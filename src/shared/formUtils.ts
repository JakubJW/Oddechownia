import { z } from 'zod';
import { ERROR_MESSAGES } from '@/shared/messages';

export const nonEmptyString = z
  .string({ error: ERROR_MESSAGES.REQUIRED })
  .trim()
  .min(1, { error: ERROR_MESSAGES.REQUIRED });
