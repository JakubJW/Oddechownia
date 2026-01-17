'use server';

import { users, subscriptions } from '@/server/db/schema';
import { db } from '@/server/db';
import { desc, eq } from 'drizzle-orm';
import { createClient } from '@/supabase/server';
import { cache } from 'react';
import { getRequiredUser } from '@/lib/data';
import { supabaseService } from '@/server/services/supabase.service';
import { UserRoles } from '../db/consts';

interface UpdateUserParams {
  firstName: string;
  lastName: string;
  email: string;
  privacyPolicyAgreement: boolean;
  regulationsAgreement: boolean;
}

export type User = Awaited<ReturnType<typeof getUser>>;

const accessGrantedStatuses = ['active', 'past_due', 'trialing'];

export const getUser = cache(async () => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const publicUser = await db.query.users.findFirst({
      where: eq(users.id, user.id),
      with: {
        subscriptions: { orderBy: desc(subscriptions.createdAt), limit: 1 },
      },
    });

    if (!publicUser) {
      return null;
    }

    const subscription = publicUser?.subscriptions[0];
    const isAdmin = publicUser.role === UserRoles.ADMIN;

    const hasActiveSubscription =
      accessGrantedStatuses.includes(subscription?.status) || isAdmin;

    return {
      ...publicUser,
      subscription,
      stripeCustomerId: publicUser.stripeCustomerId ?? undefined,
      subscriptionStatus: subscription?.status ?? null,
      hasActiveSubscription,
      isAdmin,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
});

export const updateUser = async (params: UpdateUserParams) => {
  const { error: authUpdateError } =
    await supabaseService.updateUserInAuthSchema({ email: params.email });

  if (authUpdateError) {
    return { error: authUpdateError };
  }

  const { error: publicUpdateError } = await updateUserInPublicSchema(params);

  if (publicUpdateError) {
    return { error: publicUpdateError };
  }

  return { error: null };
};

export const updateUserInPublicSchema = async ({
  firstName,
  lastName,
  email,
  regulationsAgreement,
  privacyPolicyAgreement,
}: UpdateUserParams) => {
  try {
    const user = await getRequiredUser();

    const [data] = await db
      .update(users)
      .set({
        firstName,
        lastName,
        email,
        regulationsAgreement,
        privacyPolicyAgreement,
      })
      .where(eq(users.id, user.id))
      .returning();

    return { data, error: null };
  } catch (error: unknown) {
    console.error(
      'Podczas edycji danych wystąpił błąd. Spróbuj ponownie później.',
      error
    );

    return {
      data: null,
      error: 'Podczas edycji danych wystąpił błąd. Spróbuj ponownie później.',
    };
  }
};
