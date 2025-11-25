import { z } from 'zod';

// Enum for intervals in Automatic mode
export const ScheduleIntervals = {
  DAILY: 'daily', // Every 1 day
  EVERY_OTHER_DAY: 'every_other_day', // Every 2 days
  WEEKLY: 'weekly', // Every 7 days
  WORK_DAYS: 'work_days', // Mon-Fri (skip Sat/Sun)
} as const;

// Base schema required for both modes
const BaseScheduleSchema = z.object({
  playlistId: z.number(),
  // We ask for a start time/date for the WHOLE batch
  startDate: z.date({ required_error: 'Data rozpoczęcia jest wymagana' }),
  startTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format HH:MM'),
});

export const SchedulePlaylistSchema = z.discriminatedUnion('mode', [
  // AUTOMATIC MODE
  BaseScheduleSchema.extend({
    mode: z.literal('automatic'),
    interval: z.nativeEnum(ScheduleIntervals),
  }),
  // MANUAL MODE
  BaseScheduleSchema.extend({
    mode: z.literal('manual'),
    // We expect the frontend to send the list of lessons to be scheduled
    lessons: z.array(
      z.object({
        lessonId: z.number(),
        lessonTitle: z.string(), // Just for UI, not DB
        scheduledAt: z.date(), // The specific date user chose
        included: z.boolean(), // If user wants to skip a specific lesson
      })
    ),
  }),
]);

export type SchedulePlaylistInput = z.infer<typeof SchedulePlaylistSchema>;
