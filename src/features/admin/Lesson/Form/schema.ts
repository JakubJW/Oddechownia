import { z } from 'zod';
import { nonEmptyString } from '@/shared/formUtils';
import { ERROR_MESSAGES } from '@/shared/messages';

export const createformSchema = z.object({
  name: z.string({ message: ERROR_MESSAGES.REQUIRED }).pipe(nonEmptyString),
  description: z.string(),
  videoId: z.coerce
    .number({
      invalid_type_error: 'Nieprawidłowe ID filmu.',
    })
    .int('ID filmu musi być liczbą całkowitą.')
    .optional(),
  thumbnailId: z.coerce
    .number({
      invalid_type_error: 'Nieprawidłowe ID miniatury.',
    })
    .int('ID miniatury musi być liczbą całkowitą.')
    .refine((value) => value !== undefined, 'Brak ID miniatury.')
    .optional(),
  labelIds: z.array(z.number()),
});

export const updateFormSchema = z.object({
  name: z.string({ message: ERROR_MESSAGES.REQUIRED }).pipe(nonEmptyString),
  description: z.string(),
  videoId: z.coerce
    .number({
      invalid_type_error: 'Nieprawidłowe ID filmu.',
    })
    .int('ID filmu musi być liczbą całkowitą.')
    .optional(),
  thumbnailId: z.coerce
    .number({
      invalid_type_error: 'Nieprawidłowe ID miniatury.',
    })
    .int('ID miniatury musi być liczbą całkowitą.')
    .refine((value) => value !== undefined, 'Brak ID miniatury.')
    .optional(),
  labelIds: z.array(z.number()),
});

export const defaultValues: z.infer<typeof createformSchema> = {
  name: '',
  description: '',
  videoId: undefined,
  thumbnailId: undefined,
  labelIds: [],
};

export type CreateLessonValues = z.infer<typeof createformSchema>;
export type UpdateLessonValues = z.infer<typeof updateFormSchema>;
