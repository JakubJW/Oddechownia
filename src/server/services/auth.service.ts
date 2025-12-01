import { stripeService } from '@/server/services/stripe.service';
import { db } from '../db';
import { subscriptions, users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { EmailService } from './emails.service';
import { BadRequestError } from '../lib/errors';

const fulfillSubscriptionPurchase = async (sessionId: string) => {
  const session = await stripeService.retrieveSession(sessionId);

  const userId = session.client_reference_id;

  if (!userId) {
    throw new BadRequestError('Missing user ID in session metadata.');
  }

  if (session.payment_status !== 'paid') {
    throw new BadRequestError('Session is not paid.');
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { email: true, firstName: true },
  });

  if (!user) throw new Error('User not found');

  const stripeSubscriptionId = session.subscription as string;

  const { id, status, items, cancel_at_period_end } =
    await stripeService.retrieveSubscription(stripeSubscriptionId);

  await db
    .insert(subscriptions)
    .values({
      userId: userId,
      stripeSubscriptionId: id,
      status: status,
      currentPeriodStart: new Date(
        items.data[0].current_period_start * 1000
      ).toISOString(),
      currentPeriodEnd: new Date(
        items.data[0].current_period_end * 1000
      ).toISOString(),
      cancelAtPeriodEnd: cancel_at_period_end,
    })
    .onConflictDoUpdate({
      target: [subscriptions.userId],
      set: {
        stripeSubscriptionId: id,
        status: status,
        currentPeriodStart: new Date(
          items.data[0].current_period_start * 1000
        ).toISOString(),
        currentPeriodEnd: new Date(
          items.data[0].current_period_end * 1000
        ).toISOString(),
        cancelAtPeriodEnd: cancel_at_period_end,
      },
    });

  EmailService.sendRegistrationConfirmation(user.email, user.firstName);
};

export const AuthService = { fulfillSubscriptionPurchase };
