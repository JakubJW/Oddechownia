import { z } from 'zod';
import { nonEmptyString } from '@/shared/formUtils';

export const formSchema = z.object({
  name: z.string().pipe(nonEmptyString),
  description: z.string().pipe(nonEmptyString),
  videoId: z.number().nullable().optional(),
});

export const defaultValues = {
  name: '',
  description: '',
  videoId: null,
};
