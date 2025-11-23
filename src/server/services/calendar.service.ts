import { liveLessonsRegistrations, userPracticeSchedules } from '../db/schema';
import { db } from '../db';
import { LiveLessonSchema } from '../models/liveLesson.models';
import { and, eq, gte, lte, or } from 'drizzle-orm';

export type CalendarEventType = 'live-lesson' | 'practice-session';

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
  status: 'upcoming' | 'live' | 'processing_recording' | 'completed';
  meetingLink?: string;
  recordingUrl?: string;
}

// 2. Practice Session (Editable)
export interface PracticeSessionEvent extends BaseEvent {
  type: 'practice-session';
  isCompleted: boolean;
  playlistName?: string;
  lessonId: number;
}

export type CalendarEvent = LiveLessonEvent | PracticeSessionEvent;

export const createSchedule = async (
  userId: string,
  lessonId: number,
  playlistId: number | undefined,
  scheduledAt: string
) => {
  await db.insert(userPracticeSchedules).values({
    userId,
    lessonId,
    playlistId,
    scheduledAt,
  });
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
        columns: { name: true },
        with: {
          video: {
            columns: { duration: true },
          },
        },
      },
      playlist: {
        columns: { name: true },
      },
    },
  });

  const liveData = await db.query.liveLessonsRegistrations.findMany({
    where: or(
      and(
        eq(liveLessonsRegistrations.userId, userId),
        eq(liveLessonsRegistrations.paymentStatus, 'paid'),
        eq(liveLessonsRegistrations.accessMethod, 'paid_one_time')
      ),
      and(
        eq(liveLessonsRegistrations.userId, userId),
        eq(liveLessonsRegistrations.accessMethod, 'subscription_entitlement')
      )
    ),
    with: {
      lesson: true,
    },
  });

  const events: CalendarEvent[] = [];

  for (const item of practiceData) {
    events.push({
      type: 'practice-session',
      id: item.id,
      date: item.scheduledAt,
      title: item.lesson.name,
      lessonId: item.lessonId,
      isCompleted: item.isCompleted || false,
      playlistName: item.playlist?.name,
      duration: item.lesson.video!.duration!,
    });
  }

  for (const item of liveData) {
    const lesson = item.lesson;
    if (!lesson) continue; // Safety check

    events.push({
      type: 'live-lesson',
      id: lesson.id,
      date: lesson.scheduledAt,
      title: lesson.title,
      status: getLiveLessonStatus(lesson),
      meetingLink: lesson.meetingLink || undefined,
      recordingUrl: lesson.recordingUrl || undefined,
      duration: lesson.duration,
    });
  }

  return events.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};

function getLiveLessonStatus(lesson: LiveLessonSchema) {
  const now = new Date();
  const start = new Date(lesson.scheduledAt);
  const end = new Date(start.getTime() + lesson.duration * 60000);

  if (lesson.isCompleted) return 'completed';
  if (now < start) return 'upcoming';
  if (now >= start && now <= end) return 'live';
  if (lesson.recordingUrl) return 'completed';

  return 'processing_recording';
}

export const CalendarService = {
  createSchedule,
  getUserSchedule,
};
