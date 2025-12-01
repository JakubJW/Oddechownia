import { and, count, desc, eq, gte, lte, or } from 'drizzle-orm';
import { liveLessonsRegistrations, liveLessons } from '@/server/db/schema';
import { db } from '@/server/db';
import { LiveLessonSignUpValues } from '@/features/LiveLesson/Form/schema';
import { logger } from '../lib/logger.service';
import { stripeService } from './stripe.service';
import { env } from '@/env';
import { User } from '../actions/user';
import {
  AppError,
  AuthenticationError,
  AuthorizationError,
  ConflictError,
} from '../lib/errors';
import { LiveLessonRegistrationCardDTO } from '../models/liveLessonRegistration.models';
import { EmailService } from './emails.service';
import { startOfMonth, endOfMonth } from 'date-fns';

export type PurchaseConfirmationDTO = {
  registrationId: string;
  lessonTitle: string;
  scheduledAt: string;
};

const log = logger.child({ module: 'live-lessons-registrations' });

const create = async (
  lessonId: string,
  values: LiveLessonSignUpValues,
  user: User
) => {
  const lesson = await db.query.liveLessons.findFirst({
    where: eq(liveLessons.id, lessonId),
  });

  if (!lesson) throw new Error('Lesson not found');

  const { isEligible } = await checkEntitlementEligibility(user, lesson);

  if (isEligible) {
    return await handleFreeRegistration(lessonId, values, user);
  }

  const priceId = 'price_1SS2YaFWpOu2Y0ISqYckJncc';

  if (!priceId) throw new Error('Price not configured');

  return await handlePaidRegistration(lessonId, values, priceId, user);
};

const getUsedEntitlementsCount = async (userId: string) => {
  const targetMonthStart = startOfMonth(new Date());
  const targetMonthEnd = endOfMonth(new Date());

  const [result] = await db
    .select({ count: count() })
    .from(liveLessonsRegistrations)
    .innerJoin(
      liveLessons,
      eq(liveLessonsRegistrations.lessonId, liveLessons.id)
    )
    .where(
      and(
        eq(liveLessonsRegistrations.userId, userId),
        eq(liveLessonsRegistrations.accessMethod, 'subscription_entitlement'),
        gte(liveLessons.scheduledAt, targetMonthStart.toISOString()),
        lte(liveLessons.scheduledAt, targetMonthEnd.toISOString())
      )
    );

  const usedCount = result.count;

  return usedCount;
};

const checkEntitlementEligibility = async (
  user: User,
  lesson: typeof liveLessons.$inferSelect
) => {
  if (!user || !user.hasActiveSubscription)
    return { isEligible: false, lessonsUsed: 0 };
  if (user.isAdmin) return { isEligible: true, lessonsUsed: 0 };

  const targetMonthStart = startOfMonth(new Date(lesson.scheduledAt));
  const targetMonthEnd = endOfMonth(new Date(lesson.scheduledAt));

  const [result] = await db
    .select({ count: count() })
    .from(liveLessonsRegistrations)
    .innerJoin(
      liveLessons,
      eq(liveLessonsRegistrations.lessonId, liveLessons.id)
    )
    .where(
      and(
        eq(liveLessonsRegistrations.userId, user.id),
        eq(liveLessonsRegistrations.accessMethod, 'subscription_entitlement'),
        gte(liveLessons.scheduledAt, targetMonthStart.toISOString()),
        lte(liveLessons.scheduledAt, targetMonthEnd.toISOString())
      )
    );

  const usedCount = result.count;

  return {
    isEligible: usedCount < 2,
    lessonsUsed: usedCount,
  };
};

const buildCustomerData = (user: User, values: LiveLessonSignUpValues) => {
  if (!user || !user.stripeCustomerId) {
    return { customer_email: values.email };
  }

  return { customer: user.stripeCustomerId };
};

const handlePaidRegistration = async (
  id: string,
  values: LiveLessonSignUpValues,
  stripePriceId: string,
  user: User
) => {
  const existingRegistration =
    await db.query.liveLessonsRegistrations.findFirst({
      where: and(
        eq(liveLessonsRegistrations.lessonId, id),
        eq(liveLessonsRegistrations.accessMethod, 'paid_one_time'),
        eq(liveLessonsRegistrations.paymentStatus, 'paid'),
        or(eq(liveLessonsRegistrations.email, values.email))
      ),
    });

  if (existingRegistration) {
    throw new ConflictError(
      'Free live lesson registration (found existing registration).',
      'Jesteś już zapisany na te zajęcia.'
    );
  }

  const customerDetails = buildCustomerData(user, values);

  const [registration] = await db
    .insert(liveLessonsRegistrations)
    .values({
      ...values,
      lessonId: id,
      userId: user ? user.id : null,
      accessMethod: 'paid_one_time',
    })
    .returning({ id: liveLessonsRegistrations.id });

  const session = await stripeService.createCheckoutSession({
    mode: 'payment',
    line_items: [
      {
        price: stripePriceId,
        quantity: 1,
      },
    ],
    success_url: `${env.NEXT_PUBLIC_APP_URL}/zajecia-na-zywo/sukces/{CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.NEXT_PUBLIC_APP_URL}/zajecia-na-zywo`,
    ...customerDetails,
    metadata: {
      registrationId: registration.id,
    },
  });

  await db
    .update(liveLessonsRegistrations)
    .set({
      paymentStatus: 'unpaid',
      checkoutSessionId: session.id,
      stripePriceId: stripePriceId,
    })
    .where(eq(liveLessonsRegistrations.id, registration.id));

  return { sessionUrl: session.url };
};

const handleFreeRegistration = async (
  id: string,
  values: LiveLessonSignUpValues,
  user: User
) => {
  if (!user) {
    throw new AuthenticationError(
      'Free live lesson registration (user not logged in).',
      'Aby zapisać się na zajęcia za darmo, musisz być zalogowany i posiadać aktywną subskcrypcję.'
    );
  }

  if (user.role !== 'admin' && !user.hasActiveSubscription) {
    throw new AuthorizationError(
      'Free live lesson registration (no active subscription).',
      'Aby zapisać się na zajęcia za darmo, musisz posiadać aktywną subskcrypcję.'
    );
  }

  const existingRegistration =
    await db.query.liveLessonsRegistrations.findFirst({
      where: and(
        eq(liveLessonsRegistrations.lessonId, id),
        eq(liveLessonsRegistrations.accessMethod, 'subscription_entitlement'),
        or(eq(liveLessonsRegistrations.userId, user.id))
      ),
    });

  if (existingRegistration) {
    throw new ConflictError(
      'Free live lesson registration (found existing registration).',
      'Jesteś już zapisany na te zajęcia.'
    );
  }

  await db.insert(liveLessonsRegistrations).values({
    ...values,
    lessonId: id,
    userId: user.id,
    accessMethod: 'subscription_entitlement',
  });

  return { sessionUrl: null };
};

const fullfillLiveLessonPurchase = async (
  sessionId: string
): Promise<PurchaseConfirmationDTO> => {
  const session = await stripeService.retrieveSession(sessionId);

  if (session.payment_status !== 'paid') {
    throw new Error('Payment not completed.');
  }

  const registrationId = session.metadata?.registrationId;
  if (!registrationId) throw new Error('Missing registration ID metadata.');

  const existing = await db.query.liveLessonsRegistrations.findFirst({
    where: eq(liveLessonsRegistrations.id, registrationId),
    with: { lesson: true },
  });

  if (!existing) throw new Error('Registration record not found.');

  if (existing.paymentStatus !== 'paid') {
    await db
      .update(liveLessonsRegistrations)
      .set({ paymentStatus: 'paid', checkoutSessionId: sessionId })
      .where(eq(liveLessonsRegistrations.id, registrationId));

    if (!existing.userId) {
      await EmailService.sendLiveLessonRegistrationConfirmaion(
        existing.email,
        existing.name.split(' ')[0],
        existing.lesson.title,
        existing.lesson.scheduledAt
      );

      await EmailService.scheduleLiveLessonRemind(
        existing.email,
        existing.name.split(' ')[0],
        existing.lesson.title,
        existing.lesson.scheduledAt
      );
    }
  }

  return {
    registrationId: existing.id,
    lessonTitle: existing.lesson.title,
    scheduledAt: existing.lesson.scheduledAt,
  };
};

const getLessonRegistrations = async (
  lessonId: string
): Promise<LiveLessonRegistrationCardDTO[]> => {
  try {
    const result = await db.query.liveLessonsRegistrations.findMany({
      where: eq(liveLessonsRegistrations.lessonId, lessonId),
      orderBy: desc(liveLessonsRegistrations.createdAt),
    });

    return result.map((registration) => ({
      id: registration.id,
      name: registration.name,
      email: registration.email,
      createdAt: registration.createdAt,
      paymentStatus: registration.paymentStatus ?? undefined,
    }));
  } catch (error) {
    log.error(error);

    throw new AppError(
      'An unknown error occured user registrations fetch.',
      500,
      'Podczas pobierania listy zapisanych użytkowników wystąpił niespodziewany błąd.'
    );
  }
};

export const LiveLessonsRegistrationsService = {
  getLessonRegistrations,
  create,
  checkEntitlementEligibility,
  fullfillLiveLessonPurchase,
  getUsedEntitlementsCount,
};
