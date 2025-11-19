import { z } from 'zod';
import { nonEmptyString } from '@/shared/formUtils';

export type PlaylistFormValues = z.infer<typeof formSchema>;

export const formSchema = z.object({
  name: z.string().pipe(nonEmptyString),
  description: z.string().pipe(nonEmptyString),
  videoId: z.number().optional(),
  isPublished: z.boolean(),
  isAccessibleForFree: z.boolean(),
});

export const defaultValues: PlaylistFormValues = {
  name: '',
  description: '',
  isPublished: false,
  isAccessibleForFree: false,
  videoId: undefined,
};
