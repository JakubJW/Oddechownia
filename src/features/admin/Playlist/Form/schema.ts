import { z } from 'zod';
import { nonEmptyString } from '@/shared/formUtils';

export const formSchema = z.object({
  name: z.string().pipe(nonEmptyString),
  description: z.string().pipe(nonEmptyString),
  videoId: z.number(),
  isPublished: z.boolean(),
});

export const defaultValues = {
  name: '',
  description: '',
  isPublished: false,
  videoId: undefined
};
