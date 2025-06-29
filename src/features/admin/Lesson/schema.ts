import { z } from 'zod';
import { nonEmptyString } from '@/shared/formUtils';

export const formSchema = z.object({
  name: z.string().pipe(nonEmptyString),
  description: z.string().pipe(nonEmptyString),
  courseSlug: z.string(),
  video: z.object({
    uploadId: z.string(),
  }),
});

export const defaultValues = {
  name: '',
  description: '',
  video: {
    uploadId: '',
  },
};
