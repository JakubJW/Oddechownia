import { nonEmptyString } from '@/shared/formUtils';
import z from 'zod';

export type CreateLabelValues = z.infer<typeof createLabelFormSchema>;

export const createLabelFormSchema = z.object({
  text: z.string().pipe(nonEmptyString),
  color: z.string().pipe(nonEmptyString),
});

export const createLabelFormDefaultValues: CreateLabelValues = {
  text: 'Nowa etykieta',
  color: '#000000',
};
