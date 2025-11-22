import { stripeService } from '@/server/services/stripe.service';
import { db } from '../db';
import { users } from '../db/schema';
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

  const existingUser = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { subscriptionStatus: true, email: true, firstName: true },
  });

  if (!existingUser) throw new Error('User not found');

  if (existingUser.subscriptionStatus === 'active') {
    return;
  }

  const stripeCustomerId = session.customer as string;
  const stripeSubscriptionId = session.subscription as string;

  const [updatedUser] = await db
    .update(users)
    .set({
      subscriptionStatus: 'active',
      stripeCustomerId: stripeCustomerId,
      // stripeSubscriptionId: stripeSubscriptionId, // SAVE THIS!
    })
    .where(eq(users.id, userId))
    .returning();

  await EmailService.sendRegistrationConfirmation(
    updatedUser.email,
    updatedUser.firstName
  );
};

export const AuthService = { fulfillSubscriptionPurchase };
