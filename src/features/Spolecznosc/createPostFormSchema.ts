import { nonEmptyString } from '@/shared/formUtils';
import z from 'zod';

export const createPostFormSchema = z.object({
  title: z.string().pipe(nonEmptyString),
  content: z.string().pipe(nonEmptyString),
});

export const createPostDefaultValues: CreatePostValues = {
  title: '',
  content: '',
};

export type CreatePostValues = z.infer<typeof createPostFormSchema>;
