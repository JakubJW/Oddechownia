'use server';
import 'server-only';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/supabase/server';
import { UserRoles } from '@/db/consts';
import { formSchema as loginFormSchema } from '@/features/Login/Form/schema';
import { formSchema as registerFormSchema } from '@/features/Register/Form/schema';
import { env } from '@/env';

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

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        first_name: parsed.data.firstName,
        last_name: parsed.data.lastName,
        regulations_agreement: parsed.data.regulationsAgreement,
        privacy_policy_agreement: parsed.data.privacyPolicyAgreement,
        role: UserRoles.USER,
      },
    },
  });

  if (error && error.code === 'email_exists') {
    return { data: null, error: 'Adres e-mail jest już w użyciu.' };
  }

  const res = await fetch(
    `${env.NEXT_PUBLIC_APP_URL}/api/checkout/subscription`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stripeProductId,
        customerEmail: parsed.data.email,
        clientReferenceId: data.user?.id,
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
