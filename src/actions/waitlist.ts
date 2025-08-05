'use server';

import { waitlist } from '@/db/schema';
import { ActionResult } from './types';
import { Waitlist } from '@/db/types';
import { db } from '@/db';
import { formSchema } from '@/features/Waitlist/schema';
import { z } from 'zod';

export const signInToWaitlist = async (
  payload: z.infer<typeof formSchema>
): Promise<ActionResult<Waitlist>> => {
  try {
    const [data] = await db.insert(waitlist).values(payload).returning();

    return { data, success: true, error: null };
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === '23505'
    ) {
      return {
        data: null,
        success: false,
        error: 'Podany adres e-mail znajduje się już na naszej liście.',
      };
    }

    console.error(
      'Podczas zapisu wystąpił błąd. Spróbuj ponownie później.',
      error
    );

    return {
      data: null,
      success: false,
      error: 'Podczas zapisu wystąpił błąd. Spróbuj ponownie później.',
    };
  }
};
