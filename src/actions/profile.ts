import { profiles } from '@/db/schema';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { createClient } from '@/supabase/server';

export const getProfile = async () => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.id, user.id),
    });

    if (!profile) {
      return null;
    }

    return { ...profile, ...user };
  } catch (error) {
    console.log(error);
    return null;
  }
};
