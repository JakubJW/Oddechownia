import { nonEmptyString } from '@/shared/formUtils';
import { z } from 'zod';
import { ERROR_MESSAGES } from '@/shared/messages';

export const formSchema = z.object({
  firstName: z.string().pipe(nonEmptyString),
  email: z
    .string({ required_error: ERROR_MESSAGES.REQUIRED })
    .trim()
    .min(1, { message: ERROR_MESSAGES.REQUIRED })
    .email({ message: ERROR_MESSAGES.INVALID_EMAIL }),
  emailMarketingAgreement: z
    .boolean()
    .refine((value) => value, ERROR_MESSAGES.REQUIRED),
});

export const defaultValues: z.infer<typeof formSchema> = {
  firstName: '',
  email: '',
  emailMarketingAgreement: false,
};
