import { z } from 'zod';
import { nonEmptyString } from '@/shared/formUtils';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ['application/pdf'];

const fileSchema =
  typeof window === 'undefined'
    ? z.any()
    : z
        .instanceof(File, { message: 'Proszę wybrać plik.' })
        .refine(
          (file) => file.size <= MAX_FILE_SIZE,
          `Rozmiar pliku musi być mniejszy niż ${
            MAX_FILE_SIZE / (1024 * 1024)
          }MB.`
        )
        .refine(
          (file) => ACCEPTED_FILE_TYPES.includes(file.type),
          'Plik musi byc w formacie PDF.'
        );

export const formSchema = z.object({
  name: z.string().pipe(nonEmptyString),
  description: z.string().pipe(nonEmptyString),
  videoId: z.number().nullable(),
});

export const defaultValues = {
  name: '',
  description: '',
  videoId: null,
};
