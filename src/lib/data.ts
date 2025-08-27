import { getUser } from '@/actions/user';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { userSubscription } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cache } from 'react';

export const getRequiredUser = cache(async () => {
  const user = await getUser();

  if (!user) {
    redirect('/logowanie');
  }

  const subscriptionData = await db.query.userSubscription.findMany({
    where: eq(userSubscription.userId, user.id),
  });

  return { ...user, subscriptions: subscriptionData };
});
