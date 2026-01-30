import { z } from 'zod';
import { ERROR_MESSAGES } from '@/shared/messages';
import { nonEmptyString } from '@/shared/formUtils';

export const registerDefaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  regulationsAgreement: false,
  privacyPolicyAgreement: false,
};

export const registerFormSchema = z
  .object({
    firstName: z.string().pipe(nonEmptyString),
    lastName: z.string().pipe(nonEmptyString),
    email: z
      .string()
      .email({ message: ERROR_MESSAGES.INVALID_EMAIL })
      .pipe(nonEmptyString),
    password: z.string().pipe(nonEmptyString),
    regulationsAgreement: z.preprocess(
      (value) => value === 'on' || value === 'true' || value === true,
      z.boolean().refine((val) => val, ERROR_MESSAGES.REQUIRED)
    ),
    privacyPolicyAgreement: z.preprocess(
      (value) => value === 'on' || value === 'true' || value === true,

      z.boolean().refine((value) => value, ERROR_MESSAGES.REQUIRED)
    ),
  })
  .superRefine(({ regulationsAgreement, privacyPolicyAgreement }, ctx) => {
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
  });

export type RegisterFormValues = z.infer<typeof registerFormSchema>;
