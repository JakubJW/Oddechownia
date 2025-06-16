import { z } from 'zod';
import { ERROR_MESSAGES } from '@/shared/messages';
import { nonEmptyString } from '@/shared/formUtils';

export const defaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  regulationsAgreement: false,
  privacyPolicyAgreement: false,
};

export const formSchema = z
  .object({
    firstName: z.string().pipe(nonEmptyString),
    lastName: z.string().pipe(nonEmptyString),
    email: z
      .string()
      .email({ message: ERROR_MESSAGES.INVALID_EMAIL })
      .pipe(nonEmptyString),
    password: z.string().pipe(nonEmptyString),
    passwordConfirmation: z.string().pipe(nonEmptyString),
    regulationsAgreement: z
      .boolean()
      .refine((value) => value, ERROR_MESSAGES.REQUIRED),
    privacyPolicyAgreement: z
      .boolean()
      .refine((value) => value, ERROR_MESSAGES.REQUIRED),
  })
  .superRefine(
    (
      {
        password,
        passwordConfirmation,
        regulationsAgreement,
        privacyPolicyAgreement,
      },
      ctx
    ) => {
      if (password !== passwordConfirmation) {
        ctx.addIssue({
          code: 'custom',
          message: ERROR_MESSAGES.PASSWORDS_MISMATCH,
          path: ['passwordConfirmation'],
        });
      }

      if (!regulationsAgreement) {
        ctx.addIssue({
          code: 'custom',
          message: ERROR_MESSAGES.REQUIRED,
          path: ['regulationsAgreement'],
        });
      }

      if (!privacyPolicyAgreement) {
        ctx.addIssue({
          code: 'custom',
          message: ERROR_MESSAGES.REQUIRED,
          path: ['privacyPolicyAgreement'],
        });
      }
    }
  );
