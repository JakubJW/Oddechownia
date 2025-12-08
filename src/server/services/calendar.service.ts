import {
  liveLessons,
  liveLessonsRegistrations,
  userPracticeSchedules,
} from '../db/schema';
import { db } from '../db';
import { LiveLessonSchema } from '../models/liveLesson.models';
import { and, eq, gte, lte, or } from 'drizzle-orm';
import { addDays, isWeekend } from 'date-fns';
import {
  ScheduleIntervals,
  SchedulePlaylistInput,
} from '../models/practiceSchedule.models'; // Import from where you saved step 1
import { playlistLesson } from '../db/schema'; // Import your schema
import { LiveLessonsRegistrationsService } from './liveLessonsRegistrations.service';
import { getUser } from '../actions/user';

export type CalendarEventType = 'live-lesson' | 'practice-session';
export type LiveLessonStatus = 'upcoming' | 'live' | 'completed';
export type LiveLessonRecordingStatus = 'available' | 'preparing';

// Base properties
interface BaseEvent {
  id: string;
  date: string;
  title: string;
  type: CalendarEventType;
  duration: number;
}

// 1. Live Lesson (Read Only, State-Aware)
export interface LiveLessonEvent extends BaseEvent {
  type: 'live-lesson';
  status: LiveLessonStatus;
  meetingLink?: string;
  recordingStatus?: LiveLessonRecordingStatus;
  recordingUrl?: string;
  isPaymentPending: boolean;
  isRegistered: boolean;
  isEligibleForFree: boolean;
  freeEligibilitiesUsed: number;
  description?: string;
}

// 2. Practice Session (Editable)
export interface PracticeSessionEvent extends BaseEvent {
  type: 'practice-session';
  lessonUrl: string;
}

export type CalendarEvent = LiveLessonEvent | PracticeSessionEvent;

export const createSchedule = async (
  userId: string,
  lessonId: number,
  playlistId: number | undefined,
  scheduledAt: string
) => {
  const [result] = await db
    .insert(userPracticeSchedules)
    .values({
      userId,
      lessonId,
      playlistId,
      scheduledAt,
    })
    .returning();

  return result;
};

export const updateSchedule = async (
  id: string,
  userId: string,
  values: { scheduledAt?: string; isCompleted?: boolean }
) => {
  await db
    .update(userPracticeSchedules)
    .set({
      ...values,
    })
    .where(
      and(
        eq(userPracticeSchedules.userId, userId),
        eq(userPracticeSchedules.id, id)
      )
    );
};

export const deleteSchedule = async (id: string, userId: string) => {
  await db
    .delete(userPracticeSchedules)
    .where(
      and(
        eq(userPracticeSchedules.userId, userId),
        eq(userPracticeSchedules.id, id)
      )
    );
};

export const getUserSchedule = async (
  userId: string,
  startDate?: string,
  endDate?: string
): Promise<CalendarEvent[]> => {
  const practiceData = await db.query.userPracticeSchedules.findMany({
    where: and(
      eq(userPracticeSchedules.userId, userId),
      startDate ? gte(userPracticeSchedules.scheduledAt, startDate) : undefined,
      endDate ? lte(userPracticeSchedules.scheduledAt, endDate) : undefined
    ),
    with: {
      lesson: {
        columns: { name: true, slug: true },
        with: {
          video: {
            columns: { duration: true },
          },
        },
      },
      playlist: {
        columns: { name: true, slug: true },
      },
    },
  });

  const allLessons = await db.query.liveLessons.findMany({
    where: and(
      startDate ? gte(liveLessons.scheduledAt, startDate) : undefined,
      endDate ? lte(liveLessons.scheduledAt, endDate) : undefined
    ),
    with: {
      registrations: {
        where: or(
          and(
            eq(liveLessonsRegistrations.userId, userId),
            eq(liveLessonsRegistrations.paymentStatus, 'paid'),
            eq(liveLessonsRegistrations.accessMethod, 'paid_one_time')
          ),
          and(
            eq(liveLessonsRegistrations.userId, userId),
            eq(
              liveLessonsRegistrations.accessMethod,
              'subscription_entitlement'
            )
          )
        ),
      },
    },
  });

  const events: CalendarEvent[] = [];

  for (const item of practiceData) {
    events.push({
      type: 'practice-session',
      id: item.id,
      date: item.scheduledAt,
      title: item.lesson.name,
      lessonUrl: `/studio-jogi-online/${item.playlist?.slug}/${item.lesson.slug}`,
      duration: item.lesson.video!.duration!,
    });
  }
  const user = await getUser();

  for (const item of allLessons) {
    const registrations = item.registrations;

    const { isEligible, lessonsUsed } =
      await LiveLessonsRegistrationsService.checkEntitlementEligibility(
        user,
        item
      );

    const eligibility = isEligible
      ? { isEligibleForFree: isEligible, freeEligibilitiesUsed: lessonsUsed }
      : { isEligibleForFree: isEligible, freeEligibilitiesUsed: lessonsUsed };

    const isAlreadyPaid = registrations.some((r) => r.paymentStatus === 'paid');
    const isPaymentPending =
      !isAlreadyPaid && registrations.some((r) => r.paymentStatus === 'unpaid');

    events.push({
      type: 'live-lesson',
      id: item.id,
      date: item.scheduledAt,
      title: item.title,
      description: item.description ?? undefined,
      status: getLiveLessonStatus(item),
      meetingLink: item.meetingLink || undefined,
      recordingStatus: item.recordingUrl ? 'available' : 'preparing',
      recordingUrl: item.recordingUrl ?? undefined,
      duration: item.duration,
      isRegistered: registrations.length > 0,
      ...eligibility,
      isPaymentPending,
    });
  }

  return events.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};

function getLiveLessonStatus(lesson: LiveLessonSchema): LiveLessonStatus {
  const now = new Date();
  const start = new Date(lesson.scheduledAt);
  const end = new Date(start.getTime() + lesson.duration * 60000);

  if (now < start) return 'upcoming';
  if (now >= end || lesson.isCompleted) return 'completed';
  return 'live';
}

// Helper to calculate dates
function calculateNextDate(currentDate: Date, interval: string): Date {
  let nextDate = new Date(currentDate);

  if (interval === ScheduleIntervals.DAILY) {
    nextDate = addDays(nextDate, 1);
  } else if (interval === ScheduleIntervals.EVERY_OTHER_DAY) {
    nextDate = addDays(nextDate, 2);
  } else if (interval === ScheduleIntervals.WEEKLY) {
    nextDate = addDays(nextDate, 7);
  } else if (interval === ScheduleIntervals.WORK_DAYS) {
    nextDate = addDays(nextDate, 1);
    while (isWeekend(nextDate)) {
      nextDate = addDays(nextDate, 1);
    }
  }
  return nextDate;
}

export const schedulePlaylist = async (
  userId: string,
  data: SchedulePlaylistInput
) => {
  const { playlistId, startTime } = data;
  const [hours, minutes] = startTime.split(':').map(Number);

  const entriesToInsert: {
    userId: string;
    lessonId: number;
    playlistId: number;
    scheduledAt: string; // ISO string for DB
  }[] = [];

  if (data.mode === 'automatic') {
    const lessonsInPlaylist = await db.query.playlistLesson.findMany({
      where: eq(playlistLesson.playlistId, playlistId),
      orderBy: (playlistLesson, { asc }) => [asc(playlistLesson.position)],
      with: {
        lesson: true,
      },
    });

    let currentDate = new Date(data.startDate);
    currentDate.setHours(hours, minutes, 0, 0);

    if (data.interval === ScheduleIntervals.WORK_DAYS) {
      while (isWeekend(currentDate)) {
        currentDate = addDays(currentDate, 1);
      }
    }

    for (const plItem of lessonsInPlaylist) {
      entriesToInsert.push({
        userId,
        lessonId: plItem.lessonId,
        playlistId,
        scheduledAt: currentDate.toISOString(),
      });

      currentDate = calculateNextDate(currentDate, data.interval);
    }
  } else if (data.mode === 'manual') {
    for (const item of data.lessons) {
      if (!item.included) continue;

      const specificDate = new Date(item.scheduledAt);
      specificDate.setHours(hours, minutes, 0, 0);

      entriesToInsert.push({
        userId,
        lessonId: item.lessonId,
        playlistId,
        scheduledAt: specificDate.toISOString(),
      });
    }
  }

  if (entriesToInsert.length > 0) {
    await db.insert(userPracticeSchedules).values(entriesToInsert);
  }

  return { count: entriesToInsert.length };
};

export const CalendarService = {
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getUserSchedule,
  schedulePlaylist,
};
