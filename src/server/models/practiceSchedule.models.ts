import { z } from 'zod';

export const ScheduleIntervals = {
  DAILY: 'daily',
  EVERY_OTHER_DAY: 'every_other_day',
  WEEKLY: 'weekly',
  WORK_DAYS: 'work_days',
} as const;

const BaseScheduleSchema = z.object({
  playlistId: z.number(),
  startDate: z.date({ error: 'Data rozpoczęcia jest wymagana' }),
  startTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format HH:MM'),
});

export const SchedulePlaylistSchema = z.discriminatedUnion('mode', [
  BaseScheduleSchema.extend({
    mode: z.literal('automatic'),
    interval: z.nativeEnum(ScheduleIntervals),
  }),
  BaseScheduleSchema.extend({
    mode: z.literal('manual'),
    lessons: z.array(
      z.object({
        lessonId: z.number(),
        lessonTitle: z.string(),
        scheduledAt: z.date(),
        included: z.boolean(),
      })
    ),
  }),
]);

export type SchedulePlaylistInput = z.infer<typeof SchedulePlaylistSchema>;
