'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/supabase/server';
import { UserRoles } from '@/server/db/consts';
import { formSchema as loginFormSchema } from '@/features/Login/Form/schema';
import { formSchema as registerFormSchema } from '@/features/Register/Form/schema';
import { env } from '@/env';
import { supabaseService } from '@/server/services/supabase.service.';
import { db } from '@/server/db';
import { users } from '@/server/db/schema';
import { stripeService } from '@/server/services/stripe.service.';

export const changePasswordAuthenticated = async (password: string) => {
  const { error } = await supabaseService.changePasswordAuthenticated(password);

  return error;
};

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = Object.fromEntries(formData);
  const parsed = loginFormSchema.safeParse(data);

  if (!parsed.success) {
    return { data: null, error: null };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
  }

  if (error && error.code === 'invalid_credentials') {
    return { error: 'Nieprawidłowe dane logowania', data: null };
  }

  return { data: null, error: null };
}

export async function signup(formData: FormData, stripeProductId: string) {
  const supabase = await createClient();

  const { regulationsAgreement, privacyPolicyAgreement, ...rest } =
    Object.fromEntries(formData);

  const parsed = registerFormSchema.safeParse({
    regulationsAgreement: Boolean(regulationsAgreement),
    privacyPolicyAgreement: Boolean(privacyPolicyAgreement),
    ...rest,
  });

  if (!parsed.success) {
    console.log(parsed.error.flatten());
    return { data: null, error: null };
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error && error.code === 'email_exists') {
    return { data: null, error: 'Adres e-mail jest już w użyciu.' };
  }

  if (!user) {
    return {
      data: null,
      error: 'Podczas rejestracji wystąpił błąd. Spróbuj ponownie później.',
    };
  }

  const customer = await stripeService.createCustomer({
    name: `${parsed.data.firstName} ${parsed.data.lastName}`,
    email: parsed.data.email,
  });

  await db.insert(users).values({
    id: user.id,
    firstName: parsed.data.firstName,
    lastName: parsed.data.lastName,
    email: parsed.data.email,
    regulationsAgreement: parsed.data.regulationsAgreement,
    privacyPolicyAgreement: parsed.data.privacyPolicyAgreement,
    role: UserRoles.USER,
    stripeCustomerId: customer.id,
  });

  const res = await fetch(
    `${env.NEXT_PUBLIC_APP_URL}/api/checkout/subscription`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stripeProductId,
        customerEmail: parsed.data.email,
        clientReferenceId: user.id,
      }),
    }
  );

  const { url } = await res.json();

  if (error) {
    return {
      error: 'Podczas rejestracji wystąpił błąd. Spróbuj ponownie później.',
      data: null,
    };
  }

  return { data: url, error: null };
}

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/');
}
