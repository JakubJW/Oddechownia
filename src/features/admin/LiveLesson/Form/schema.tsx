import { z } from 'zod';
import { nonEmptyString } from '@/shared/formUtils';
import { ERROR_MESSAGES } from '@/shared/messages';

export const createformSchema = z.object({
  thumbnailId: z.coerce
    .number({
      invalid_type_error: 'Nieprawidłowe ID miniatury.',
    })
    .int('ID miniatury musi być liczbą całkowitą.')
    .refine((value) => value !== undefined, 'Brak ID miniatury.')
    .optional(),
  title: z.string({ message: ERROR_MESSAGES.REQUIRED }).pipe(nonEmptyString),
  date: z.string({ message: ERROR_MESSAGES.REQUIRED }).pipe(nonEmptyString),
  time: z.string({ message: ERROR_MESSAGES.REQUIRED }).pipe(nonEmptyString),
  scheduledAt: z.string(),
  duration: z.coerce
    .number({
      invalid_type_error: 'Czas trwania musi być liczbą.',
    })
    .int('Czas trwania musi być liczbą całkowitą.')
    .min(15, 'Minimalny czas trwania to 15 minut.')
    .max(360, 'Maksymalny czas trwania to 360 minut.'),
  description: z
    .string()
    .optional()
    .transform((value) => (value === '' ? undefined : value)),
  meetingLink: z
    .string()
    .optional()
    .transform((value) => (value === '' ? undefined : value)),
});

export const updateFormSchema = createformSchema.extend({
  recordingUrl: z
    .string()
    .optional()
    .transform((value) => (value === '' ? undefined : value)),
  isCompleted: z.boolean(),
  isListed: z.boolean(),
  isPublished: z.boolean(),
});

export const defaultValues: z.infer<typeof createformSchema> = {
  thumbnailId: undefined,
  title: '',
  date: '',
  time: '',
  scheduledAt: new Date().toISOString(),
  duration: 15,
  description: undefined,
  meetingLink: undefined,
};

export type CreateLiveLessonValues = z.infer<typeof createformSchema>;
export type UpdateLiveLessonValues = z.infer<typeof updateFormSchema>;
