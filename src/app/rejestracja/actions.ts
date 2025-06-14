'use server';
import 'server-only';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/supabase/server';
import { UserRoles } from '@/db/consts';
import { formSchema as loginFormSchema } from '@/features/Login/Form/schema';
import { formSchema as registerFormSchema } from '@/features/Register/Form/schema';

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

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const data = Object.fromEntries(formData);
  const parsed = registerFormSchema.safeParse(data);

  if (!parsed.success) {
    return { data: null, error: null };
  }

  const { error } = await supabase.auth.signUp({
    email: parsed.data.accountData.email,
    password: parsed.data.accountData.password,
    options: {
      data: {
        first_name: parsed.data.accountData.firstName,
        last_name: parsed.data.accountData.lastName,
        regulations_agreement: parsed.data.accountData.regulationsAgreement,
        privacy_policy_agreement:
          parsed.data.accountData.privacyPolicyAgreement,
        role: UserRoles.USER,
      },
    },
  });

  if (error) {
  }

  if (error && error.code === 'invalid_credentials') {
    return { error: 'Nieprawidłowe dane logowania', data: null };
  }
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
