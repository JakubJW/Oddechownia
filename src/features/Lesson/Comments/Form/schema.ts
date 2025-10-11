import { nonEmptyString } from '@/shared/formUtils';
import { z } from 'zod';

export const formSchema = z.object({
  content: z.string().pipe(nonEmptyString),
});

export const defaultValues = {
  content: '',
};
