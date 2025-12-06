import { nonEmptyString } from '@/shared/formUtils';
import z from 'zod';

export const createReplyFormSchema = z.object({
  content: z.string().pipe(nonEmptyString),
});

export const createReplyDefaultValues: CreateReplyValues = {
  content: '',
};

export type CreateReplyValues = z.infer<typeof createReplyFormSchema>;
