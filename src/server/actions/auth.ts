'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/supabase/server';
import { UserRoles } from '@/server/db/consts';
import { formSchema as loginFormSchema } from '@/features/Login/Form/schema';
import { formSchema as registerFormSchema } from '@/features/Register/Form/schema';
import { env } from '@/env';
import { supabaseService } from '@/server/services/supabase.service';
import { db } from '@/server/db';
import { users } from '@/server/db/schema';
import { stripeService } from '@/server/services/stripe.service';
import { eq } from 'drizzle-orm';

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

  if (error && error.code === 'invalid_credentials') {
    return { error: 'Nieprawidłowe dane logowania', data: null };
  }

  return { data: null, error: null };
}

export async function adminSignIn(formData: FormData) {
  const supabase = await createClient();

  const data = Object.fromEntries(formData);
  const parsed = loginFormSchema.safeParse(data);

  if (!parsed.success) {
    return { data: null, error: null };
  }

  const {
    error,
    data: { user },
  } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (!user || (error && error.code === 'invalid_credentials')) {
    return { error: 'Nieprawidłowe dane logowania', data: null };
  }

  try {
    const [userRecord] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, user.id));

    if (!userRecord || userRecord.role !== 'admin') {
      await signOut();
      return {
        success: false,
        error: 'Access denied. You are not authorized as an admin.',
      };
    }

    return { data: null, error: null };
  } catch (dbError) {
    console.error('DB Role Check Failed:', dbError);
    await supabase.auth.signOut();
    return {
      success: false,
      error: 'An internal error occurred during role verification.',
    };
  }
}

export async function signup(formData: FormData, priceId?: string) {
  const supabase = await createClient();

  const { regulationsAgreement, privacyPolicyAgreement, ...rest } =
    Object.fromEntries(formData);

  const parsed = registerFormSchema.safeParse({
    regulationsAgreement: Boolean(regulationsAgreement),
    privacyPolicyAgreement: Boolean(privacyPolicyAgreement),
    ...rest,
  });

  if (!parsed.success) {
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

  if (priceId) {
    const session = await stripeService.createCheckoutSession({
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer: customer.id,
      success_url: `${env.NEXT_PUBLIC_APP_URL}/rejestracja/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.NEXT_PUBLIC_APP_URL}/dolacz-do-nas`,
      client_reference_id: user.id,
      subscription_data: {
        metadata: { userId: user.id },
      },
    });

    return { data: { url: session.url }, error: null };
  }

  if (error) {
    return {
      error: 'Podczas rejestracji wystąpił błąd. Spróbuj ponownie później.',
      data: null,
    };
  }

  return { data: null, error: null };
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
