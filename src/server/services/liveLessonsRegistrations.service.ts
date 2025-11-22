import { and, desc, eq, gte, or } from 'drizzle-orm';
import { liveLessonsRegistrations } from '@/server/db/schema';
import { db } from '@/server/db';
import { LiveLessonSignUpValues } from '@/features/LiveLesson/Form/schema';
import { BillingService } from './billing.service';
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

export type PurchaseConfirmationDTO = {
  registrationId: string;
  lessonTitle: string;
  scheduledAt: string;
};

const log = logger.child({ module: 'live-lessons-registrations' });

const create = async (
  id: string,
  values: LiveLessonSignUpValues,
  user: User
) => {
  let isEligible = false;
  let billingPeriodStart = undefined;

  if (user) {
    const eligibility = await checkEntitlementEligibility(user);
    const cycle = await BillingService.getCurrentBillingCycle(user);

    billingPeriodStart = cycle.start;
    isEligible = eligibility.isEligible;
  }

  const prices = await stripeService.listPrices({
    active: true,
    limit: 100,
    type: 'one_time',
  });

  if (!isEligible) {
    return await handlePaidRegistration(id, values, prices.data[0].id, user);
  }

  await handleFreeRegistration(
    id,
    values,
    prices.data[0].id,
    user,
    billingPeriodStart
  );
};

const getEntitlementUsage = async (user: User, cycleStart: string) => {
  if (!user) return 2;

  const result = await db.query.liveLessonsRegistrations.findMany({
    columns: { id: true },
    where: and(
      eq(liveLessonsRegistrations.userId, user.id),
      gte(liveLessonsRegistrations.billingPeriodStart, cycleStart)
    ),
  });

  return result.length;
};

type Eligibility =
  | {
      isEligible: false;
      lessonsUsed: number | null;
    }
  | {
      isEligible: true;
      lessonsUsed: number;
    };

const checkEntitlementEligibility = async (
  user: User
): Promise<Eligibility> => {
  const cycle = await BillingService.getCurrentBillingCycle(user);

  if (!user || !cycle.start)
    return {
      isEligible: false,
      lessonsUsed: null,
    };

  const usageCount = await getEntitlementUsage(user, cycle.start);

  return {
    isEligible: usageCount < 2,
    lessonsUsed: usageCount,
  };
};

const buildCustomerData = (user: User, values: LiveLessonSignUpValues) => {
  if (!user) {
    return { customer_email: values.email };
  }

  if (!user.stripeCustomerId) {
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
  stripePriceId: string,
  user: User,
  billingPeriodStart?: string
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
    stripePriceId,
    billingPeriodStart,
  });

  return;
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
  getEntitlementUsage,
  fullfillLiveLessonPurchase,
};
