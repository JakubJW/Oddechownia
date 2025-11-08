'use server';

import { users } from '@/server/db/schema';
import { db } from '@/server/db';
import { eq, and } from 'drizzle-orm';
import { createClient } from '@/supabase/server';
import { cache } from 'react';
import { getRequiredUser } from '@/lib/data';
import { supabaseService } from '@/server/services/supabase.service';
import { userSubscription } from '@/server/db/schema';

interface UpdateUserParams {
  firstName: string;
  lastName: string;
  email: string;
  privacyPolicyAgreement: boolean;
  regulationsAgreement: boolean;
}

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
    });

    const hasActiveSubscription = await db.query.userSubscription.findFirst({
      where: and(
        eq(userSubscription.userId, user.id),
        eq(userSubscription.status, 'active')
      ),
    });

    if (!publicUser) {
      return null;
    }

    return {
      ...publicUser,
      hasActiveSubscription: hasActiveSubscription ? true : false,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
});

export const getUserWithSubscriptions = cache(async () => {
  const user = await getRequiredUser();

  const subscriptions = await db.query.userSubscription.findMany({
    where: eq(userSubscription.userId, user.id),
  });

  return { ...user, subscriptions };
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
