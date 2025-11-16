import { z } from 'zod';
import { ERROR_MESSAGES } from '@/shared/messages';
import { nonEmptyString } from '@/shared/formUtils';

export type LiveLessonSignUpValues = z.infer<typeof liveLessonSignUpFormSchema>;

export const liveLessonSignUpFormSchema = z.object({
  name: z.string({ message: ERROR_MESSAGES.REQUIRED }),
  email: z
    .string({ message: ERROR_MESSAGES.REQUIRED })
    .email({ message: ERROR_MESSAGES.INVALID_EMAIL })
    .pipe(nonEmptyString),
});

export const liveLessonSignUpFormDefaultValues: LiveLessonSignUpValues = {
  name: '',
  email: '',
};
