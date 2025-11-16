import { and, eq, gte, sql } from 'drizzle-orm';
import { liveLessons, liveLessonsRegistrations } from '@/server/db/schema';
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

const log = logger.child({ module: 'live-lessons-registrations' });

const getUserRegistrations = async (userId: string) => {
  const result = await db.query.liveLessonsRegistrations.findMany({
    columns: { lessonId: true, paymentStatus: true },
    where: eq(liveLessonsRegistrations.userId, userId),
  });

  return result;
};

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
  const customerDetails = buildCustomerData(user, values);

  if (user) {
    const unpaidAttempt = await db.query.liveLessonsRegistrations.findFirst({
      columns: {
        id: true,
      },
      where: and(
        eq(liveLessonsRegistrations.lessonId, id),
        eq(liveLessonsRegistrations.userId, user.id),
        eq(liveLessonsRegistrations.paymentStatus, 'unpaid')
      ),
    });

    if (unpaidAttempt) {
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
          registrationId: id,
        },
      });

      return { sessionUrl: session.url };
    }
  }

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

  if (!user.hasActiveSubscription) {
    throw new AuthorizationError(
      'Free live lesson registration (no active subscription).',
      'Aby zapisać się na zajęcia za darmo, musisz posiadać aktywną subskcrypcję.'
    );
  }

  const existingRegistration =
    await db.query.liveLessonsRegistrations.findFirst({
      where: and(
        eq(liveLessonsRegistrations.lessonId, id),
        eq(liveLessonsRegistrations.userId, user.id),
        eq(liveLessonsRegistrations.accessMethod, 'subscription_entitlement')
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

  await db
    .update(liveLessons)
    .set({ currentParticipants: sql`${liveLessons.currentParticipants} + 1` })
    .where(eq(liveLessons.id, id));

  return;
};

const fullfillLiveLessonPurchase = async (sessionId: string) => {
  try {
    const session = await stripeService.retrieveSession(sessionId);

    if (!session.metadata || !session.metadata.registrationId) {
      throw new Error(
        'Podczas procesowania płatności wystąpił błąd. Skontaktuj się z administratorem systemu.'
      );
    }

    if (session.payment_status === 'paid') {
      await db
        .update(liveLessonsRegistrations)
        .set({
          paymentStatus: session.payment_status,
        })
        .where(
          eq(liveLessonsRegistrations.id, session.metadata.registrationId)
        );

      const registration = await db.query.liveLessonsRegistrations.findFirst({
        columns: { id: true },
        where: eq(liveLessonsRegistrations.id, session.metadata.registrationId),
        with: {
          lesson: {
            columns: { id: true },
          },
        },
      });

      if (!registration) {
        throw new AppError(
          "There's no registration associated with registrationId in session's metadata field.",
          500,
          'Przepraszamy, podczas zapisu na lekcję wystąpił niespodziewany błąd. Skontaktuj się z administratorem systemu.'
        );
      }

      await db
        .update(liveLessons)
        .set({
          currentParticipants: sql`${liveLessons.currentParticipants} + 1`,
        })
        .where(eq(liveLessons.id, registration.lesson.id));
    }

    log.debug('Live lesson purchase processing completed.');

    return session.metadata.registrationId;
  } catch (error) {
    log.error(error);

    throw new AppError(
      'An unknown error occured during paid registration fullfillment.',
      500,
      'Przepraszamy, podczas zapisu na lekcję wystąpił niespodziewany błąd. Skontaktuj się z administratorem systemu.'
    );
  }
};

export const LiveLessonsRegistrationsService = {
  getUserRegistrations,
  create,
  checkEntitlementEligibility,
  getEntitlementUsage,
  fullfillLiveLessonPurchase,
};
