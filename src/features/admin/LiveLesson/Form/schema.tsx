import { z } from 'zod';
import { nonEmptyString } from '@/shared/formUtils';
import { ERROR_MESSAGES } from '@/shared/messages';

export const formSchema = z.object({
  title: z.string().pipe(nonEmptyString),
  // date: z.string().pipe(nonEmptyString).optional(),
  // time: z.string().pipe(nonEmptyString).optional(),
  duration: z.string({ message: ERROR_MESSAGES.REQUIRED }).refine((value) => {
    if (isNaN(parseInt(value))) return false;
    return true;
  }, { message: "Proszę wprowadzić liczbę" }),
  description: z.string().optional(),
  meetingLink: z.string().optional(),
});

export const defaultValues: z.infer<typeof formSchema> = {
  title: '',
  // date: '',
  // time: '',
  duration: '15',
  description: undefined,
  meetingLink: undefined,
};
