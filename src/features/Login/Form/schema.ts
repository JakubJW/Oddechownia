import { z } from 'zod';
import { ERROR_MESSAGES } from '@/shared//messages';
import { nonEmptyString } from '@/shared/formUtils';

export const formSchema = z.object({
  email: z
    .string()
    .email({ message: ERROR_MESSAGES.INVALID_EMAIL })
    .pipe(nonEmptyString),
  password: z.string().pipe(nonEmptyString),
});

export const defaultValues = {
  email: '',
  password: '',
};
