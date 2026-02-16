import { desc, eq } from 'drizzle-orm';
import { db } from './db';
import { subscriptions } from './db/schema';
import { ISubscriptionRepository } from './interfaces/subscription.repository.interface';

export class SubscriptionRepository implements ISubscriptionRepository {
  async hasActiveSubscriptionAfterTrial(userId: string): Promise<boolean> {
    const result = await db
      .select({
        status: subscriptions.status,
        currentPeriodEnd: subscriptions.currentPeriodEnd,
      })
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .orderBy(desc(subscriptions.createdAt))
      .limit(1);

    if (result.length === 0) return false;

    const subscription = result[0];

    if (subscription.status !== 'active') return false;

    if (!subscription.currentPeriodEnd) return false;

    const now = new Date();
    const periodEnd = new Date(subscription.currentPeriodEnd);

    return periodEnd > now;
  }
}
