'use server';
import 'server-only';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/supabase/server';
import { UserRoles } from '@/db/consts';
import { formSchema } from '@/features/Login/Form/schema';

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = Object.fromEntries(formData);
  const parsed = formSchema.safeParse(data);

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

  const userData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    regulationsAgreement: Boolean(formData.get('regulationsAgreement')),
    privacyPolicyAgreement: Boolean(formData.get('privacyPolicyAgreement')),
  };

  const { error } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: {
      data: {
        first_name: userData.firstName,
        last_name: userData.lastName,
        regulations_agreement: userData.regulationsAgreement,
        privacy_policy_agreement: userData.privacyPolicyAgreement,
        role: UserRoles.USER,
      },
    },
  });

  if (error) {
    console.log(error);
    // redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/');
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
