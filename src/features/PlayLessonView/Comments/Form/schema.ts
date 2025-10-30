import { nonEmptyString } from '@/shared/formUtils';
import { z } from 'zod';

export const formSchema = z.object({
  content: z.string().pipe(nonEmptyString),
  parentId: z.number().optional().nullable(),
});

export const defaultValues = {
  content: '',
  parentId: null,
};
