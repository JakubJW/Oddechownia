import { db } from '@/server/db';
import { subscriptions } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export const getUserSubscription = async (userId: string) => {
  const sub = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, userId),
  });

  if (!sub) return null;

  const isValid =
    sub.status === 'active' ||
    sub.status === 'trialing' ||
    (sub.status === 'canceled' && new Date(sub.currentPeriodEnd) > new Date());

  return { ...sub, isValid };
};
