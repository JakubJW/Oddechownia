import { z } from 'zod';
import { ERROR_MESSAGES } from '@/shared/messages';
import { nonEmptyString } from '@/shared/formUtils';

export const defaultValues = {
  oldPassword: '',
  newPassword: '',
  newPasswordConfirmation: '',
};

export const formSchema = z
  .object({
    oldPassword: z.string().pipe(nonEmptyString),
    newPassword: z.string().pipe(nonEmptyString),
    newPasswordConfirmation: z.string().pipe(nonEmptyString),
  })
  .superRefine(({ newPassword, newPasswordConfirmation }, ctx) => {
    if (newPassword !== newPasswordConfirmation) {
      ctx.addIssue({
        code: 'custom',
        message: ERROR_MESSAGES.PASSWORDS_MISMATCH,
        path: ['newPasswordConfirmation'],
      });
    }
  });
