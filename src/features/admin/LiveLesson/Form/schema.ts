import { z } from 'zod';
import { nonEmptyString } from '@/shared/formUtils';
import { ERROR_MESSAGES } from '@/shared/messages';
import { SUBSCRIBER_ACCESS } from '@/entities/models/product';

export const createformSchema = z.object({
  title: z.string({ error: ERROR_MESSAGES.REQUIRED }).pipe(nonEmptyString),
  date: z.string({ error: ERROR_MESSAGES.REQUIRED }).pipe(nonEmptyString),
  time: z.string({ error: ERROR_MESSAGES.REQUIRED }).pipe(nonEmptyString),
  scheduledAt: z.string(),
  priceId: z.string(),
  price: z.int(),
  isFree: z.boolean(),
  imageId: z.int(),
  subscriberAccess: z.nativeEnum(SUBSCRIBER_ACCESS),
  duration: z
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
  imageId: z.int().optional(),
  recordingUrl: z
    .string()
    .optional()
    .transform((value) => (value === '' ? undefined : value)),
  isCompleted: z.boolean(),
  isListed: z.boolean(),
  isPublished: z.boolean(),
});

export const defaultValues: z.infer<typeof createformSchema> = {
  price: 0,
  imageId: 0,
  isFree: false,
  subscriberAccess: SUBSCRIBER_ACCESS.QUOTA_BASED,
  priceId: '',
  title: '',
  date: '',
  time: '',
  scheduledAt: new Date().toISOString(),
  duration: 15,
  description: undefined,
  meetingLink: undefined,
};

export type TCreateLiveLessonSchema = z.infer<typeof createformSchema>;
export type TUpdateLiveLessonSchema = z.infer<typeof updateFormSchema>;
