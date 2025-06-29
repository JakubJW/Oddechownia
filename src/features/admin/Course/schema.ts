import { z } from 'zod';
import { nonEmptyString } from '@/shared/formUtils';

export const formSchema = z.object({
  name: z.string().pipe(nonEmptyString),
  description: z.string().pipe(nonEmptyString),
  isPublished: z.boolean(),
  isOneOff: z.boolean(),
  priceInCents: z.number().optional(),
});

export const defaultValues = {
  name: '',
  description: '',
  isPublished: false,
  isOneOff: false,
  priceInCents: 0,
};
