'use server';

import { users } from '@/db/schema';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { createClient } from '@/supabase/server';
import { cache } from 'react';
import { getRequiredUser } from '@/lib/data';
import { supabaseService } from '@/services/supabase';

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

    if (!publicUser) {
      return null;
    }

    return { ...publicUser };
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
