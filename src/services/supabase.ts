import { createClient } from '@/supabase/server';
import { UserAttributes } from '@supabase/supabase-js';
import { getRequiredUser } from '@/lib/data';

const updateUserInAuthSchema = async (params: UserAttributes) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.updateUser({
    ...params,
  });

  return { data, error };
};

const changePasswordAuthenticated = async (password: string) => {
  const supabase = await createClient();
  const { email } = await getRequiredUser();

  if (!email) {
    return {
      data: null,
      error: 'Podczas zmiany hasła wystąpił błąd. Spróbuj ponownie później.',
    };
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return { data: null, error: 'Podane stare hasło jest nieprawidłowe.' };
  }

  const { error: updateError } = await updateUserInAuthSchema({ password });

  if (updateError) {
    return {
      data: null,
      error: 'Podczas zmiany hasła wystąpił błąd. Spróbuj ponownie później.',
    };
  }

  return { data: null, error: null };
};

export const supabaseService = {
  updateUserInAuthSchema,
  changePasswordAuthenticated,
};
