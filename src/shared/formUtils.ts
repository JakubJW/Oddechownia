import { z } from 'zod';
import { ERROR_MESSAGES } from '@/shared/messages';

export const nonEmptyString = z
  .string({ required_error: ERROR_MESSAGES.REQUIRED })
  .trim()
  .min(1, { message: ERROR_MESSAGES.REQUIRED });
