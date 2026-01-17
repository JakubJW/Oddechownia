'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/supabase/server';
import { UserRoles } from '@/server/db/consts';
import { formSchema as loginFormSchema } from '@/features/Login/Form/schema';
import { RegisterFormValues } from '@/features/Register/Form/registerFormSchema';
import { env } from '@/env';
import { supabaseService } from '@/server/services/supabase.service';
import { db } from '@/server/db';
import { users } from '@/server/db/schema';
import { stripeService } from '@/server/services/stripe.service';
import { eq } from 'drizzle-orm';
import { AppError, ConflictError } from '../lib/errors';
import { createClient as createAdminClient } from '@supabase/supabase-js';

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

export async function requestPasswordReset(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${env.NEXT_PUBLIC_APP_URL}/api/auth/callback?next=/ustaw-nowe-haslo`,
  });

  if (error) throw new Error(error);
}

export async function updatePassword(password: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) throw new Error(error);
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

export async function signUp(values: RegisterFormValues) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
  });

  if (error && error.code === 'user_already_exists') {
    throw new ConflictError('Users', 'Podany adres e-mail jest już zajęty.');
  }

  if (!user) {
    throw new AppError(
      'Unable to sign up user during registration process.',
      500,
      'Przepraszamy. Podczas rejestracji wystąpił błąd.'
    );
  }

  let stripeCustomerId: string | null = null;

  try {
    const customer = await stripeService.createCustomer({
      name: `${values.firstName} ${values.lastName}`,
      email: values.email,
    });

    stripeCustomerId = customer.id;

    await db.insert(users).values({
      id: user.id,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      regulationsAgreement: values.regulationsAgreement,
      privacyPolicyAgreement: values.privacyPolicyAgreement,
      role: UserRoles.USER,
      stripeCustomerId: customer.id,
    });

    const session = await stripeService.createCheckoutSession({
      mode: 'subscription',
      line_items: [
        {
          price: env.NEXT_STRIPE_SUBSCRIPTION_PRICE_ID,
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      customer: customer.id,
      success_url: `${env.NEXT_PUBLIC_APP_URL}/rejestracja/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.NEXT_PUBLIC_APP_URL}/moje-konto`,
      client_reference_id: user.id,
      subscription_data: {
        metadata: { userId: user.id },
        trial_period_days: 1,
      },
    });

    if (!session.url) {
      throw new AppError(
        'Unable to sign up user during registration process. No session url.',
        undefined,
        'Przepraszamy. Podczas rejestracji wystąpił błąd.'
      );
    }

    return session.url;
  } catch (error) {
    console.error(
      'Registration failed, starting rollback for user:',
      user.id,
      error
    );

    try {
      await db.delete(users).where(eq(users.id, user.id));
    } catch (e) {
      console.error('Failed to cleanup DB user:', e);
    }

    if (stripeCustomerId) {
      try {
        await stripeService.deleteCustomer(stripeCustomerId);
      } catch (e) {
        console.error('Failed to cleanup Stripe customer:', e);
      }
    }

    try {
      const supabaseAdmin = createAdminClient(
        env.NEXT_PUBLIC_SUPABASE_URL,
        env.NEXT_SUPABASE_SERVICE_ROLE_KEY,
        {
          auth: {
            persistSession: false,
          },
        }
      );
      await supabaseAdmin.auth.admin.deleteUser(user.id);
    } catch (e) {
      console.error('CRITICAL: Failed to delete Supabase Auth user:', e);
    }

    throw new AppError(
      'Registration process failed during setup.',
      500,
      'Wystąpił błąd podczas konfiguracji konta. Spróbuj ponownie.'
    );
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
