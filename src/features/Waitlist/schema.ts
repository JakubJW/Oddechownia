import { nonEmptyString } from '@/shared/formUtils';
import { z } from 'zod';
import { ERROR_MESSAGES } from '@/shared/messages';

export const formSchema = z.object({
  firstName: z.string().pipe(nonEmptyString),
  email: z
    .email({ message: ERROR_MESSAGES.INVALID_EMAIL })
    .trim()
    .min(1, { error: ERROR_MESSAGES.REQUIRED }),
  emailMarketingAgreement: z
    .boolean()
    .refine((value) => value, ERROR_MESSAGES.REQUIRED),
});

export const defaultValues: z.infer<typeof formSchema> = {
  firstName: '',
  email: '',
  emailMarketingAgreement: false,
};
