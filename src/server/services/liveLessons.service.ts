import {
  createformSchema,
  updateFormSchema,
} from '@/features/admin/LiveLesson/Form/schema';
import { and, asc, desc, eq, lt, or } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { liveLessons, liveLessonsRegistrations } from '../db/schema';
import { logger } from '../lib/logger.service';
import {
  AdminLiveLessonRecordDTO,
  LiveLessonCardDTO,
  LiveLessonCardUserDashboardDTO,
} from '../models/liveLesson.models';
import { User } from '../actions/user';
import { AuthenticationError, NotFoundError } from '../lib/errors';
import { EmailService, templates } from './emails.service';
import { CreateBatchOptions } from 'resend';

function normalizeInput<T extends Record<string, unknown>>(input: T): T {
  const normalized = { ...input };
  for (const key in normalized) {
    if (normalized[key] === undefined) {
      (normalized as Record<string, unknown>)[key] = null;
    }
  }
  return normalized;
}

const log = logger.child({ module: 'live-lessons' });

const create = async (values: z.infer<typeof createformSchema>) => {
  await db.insert(liveLessons).values({
    ...values,
  });
};

const update = async (id: string, values: z.infer<typeof updateFormSchema>) => {
  const currentLesson = await db.query.liveLessons.findFirst({
    columns: { recordingUrl: true },
    where: eq(liveLessons.id, id),
  });

  if (!currentLesson) {
    throw new NotFoundError('Live lesson');
  }

  const cleanValues = normalizeInput(values);

  const [updatedLesson] = await db
    .update(liveLessons)
    .set({ ...values })
    .where(eq(liveLessons.id, id))
    .returning();

  const recordingChanged =
    cleanValues.recordingUrl !== currentLesson.recordingUrl;

  const shouldNotify =
    recordingChanged && typeof updatedLesson.recordingUrl === 'string';

  if (shouldNotify) {
    await notifyRegistrantsAboutRecording(
      updatedLesson.id,
      updatedLesson.title,
      updatedLesson.recordingUrl!
    );
  }

  return updatedLesson;
};

const transformToAdminLiveLessonRecordListDTO = (
  liveLessons: SelectAdminLiveLessons
): AdminLiveLessonRecordDTO[] => {
  return liveLessons.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    scheduledAt: lesson.scheduledAt,
    duration: lesson.duration,
    isListed: lesson.isListed,
    isCompleted: lesson.isCompleted,
    isPublished: lesson.isPublished,
    description: lesson.description ?? undefined,
    meetingLink: lesson.meetingLink ?? undefined,
    recordingUrl: lesson.recordingUrl ?? undefined,
    currentParticipants: lesson.registrations.length,
    thumbnail: lesson.thumbnail
      ? supabaseService.getThumbnailUrl(
          lesson.thumbnail.bucket,
          lesson.thumbnail.path
        ).data
      : undefined,
  }));
};

const selectAdminLiveLessons = async (
  cursor: string | null,
  perPage: number = 6
) => {
  const cursorCondition = cursor
    ? lt(liveLessons.scheduledAt, cursor)
    : undefined;

  const result = await db.query.liveLessons.findMany({
    where: cursorCondition,
    orderBy: desc(liveLessons.scheduledAt),
    with: {
      thumbnail: true,
      registrations: {
        columns: { id: true },
        where: or(
          and(
            eq(liveLessonsRegistrations.paymentStatus, 'paid'),
            eq(liveLessonsRegistrations.accessMethod, 'paid_one_time')
          ),
          eq(liveLessonsRegistrations.accessMethod, 'subscription_entitlement')
        ),
      },
    },
    limit: perPage,
  });

  return result;
};

type SelectAdminLiveLessons = Awaited<
  ReturnType<typeof selectAdminLiveLessons>
>;

const getMany = async (cursor: string | null, perPage: number = 6) => {
  const result = await selectAdminLiveLessons(cursor, perPage);

  return transformToAdminLiveLessonRecordListDTO(result);
};

import { format } from 'date-fns'; // Make sure you have this
import { supabaseService } from './supabase.service';

async function getLiveLessonsWithUserStatus(
  user: User
): Promise<LiveLessonCardDTO[]> {
  // 1. Fetch Lessons (Existing logic)

  const lessons = await db.query.liveLessons.findMany({
    with: {
      thumbnail: true,
      registrations: user
        ? {
            where: eq(liveLessonsRegistrations.userId, user.id),
          }
        : undefined,
    },
    where: eq(liveLessons.isListed, false), // Or whatever your filter logic is
    orderBy: liveLessons.scheduledAt,
  });

  if (!user) {
    // Return basic DTO for guests
    return lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description ?? undefined,
      scheduledAt: lesson.scheduledAt,
      duration: lesson.duration,
      isListed: lesson.isListed,
      isRegistered: false,
      isPaymentPending: false,
      isEligibleForFree: false,
      freeEligibilitiesUsed: 0,
      thumbnail: lesson.thumbnail
        ? supabaseService.getThumbnailUrl(
            lesson.thumbnail.bucket,
            lesson.thumbnail.path
          ).data
        : undefined,
    }));
  }

  // 3. Build a "Usage Map" per Month
  // We need to find out how many free credits the user consumed in EACH month relevant to the lessons.

  // Fetch all registrations where user utilized the "Subscription Entitlement"
  const entitlementRegistrations =
    await db.query.liveLessonsRegistrations.findMany({
      where: and(
        eq(liveLessonsRegistrations.userId, user.id),
        // Check for your specific flag, e.g., 'subscription_entitlement' or usedFreeCredit: true
        eq(liveLessonsRegistrations.accessMethod, 'subscription_entitlement')
      ),
      with: {
        lesson: {
          columns: { scheduledAt: true }, // We need the date of the consumed lesson
        },
      },
    });

  // Group counts by "YYYY-MM"
  const usageByMonth = new Map<string, number>();

  for (const reg of entitlementRegistrations) {
    if (!reg.lesson) continue;
    const monthKey = format(new Date(reg.lesson.scheduledAt), 'yyyy-MM');
    usageByMonth.set(monthKey, (usageByMonth.get(monthKey) || 0) + 1);
  }

  // 4. Map the lessons with context-aware eligibility
  return lessons.map((lesson) => {
    const lessonDate = new Date(lesson.scheduledAt);
    const monthKey = format(lessonDate, 'yyyy-MM');

    // How many credits were used in THIS lesson's month?
    const usedInThisMonth = usageByMonth.get(monthKey) || 0;
    const LIMIT_PER_MONTH = 2;

    // Eligibility Logic:
    // 1. Must have active sub
    // 2. Must not have exceeded limit for THAT specific month
    const isEligibleForFree =
      user.hasActiveSubscription && usedInThisMonth < LIMIT_PER_MONTH;

    // Registration / Payment Logic (Existing)
    const myRegistrations = lesson.registrations || [];
    const isRegistered = myRegistrations.length > 0;

    // Check if we have a valid entry (Paid OR Entitlement)
    const hasValidEntry = myRegistrations.some(
      (r) =>
        r.paymentStatus === 'paid' ||
        r.accessMethod === 'subscription_entitlement'
    );

    // Pending is strictly when we have a registration but no valid payment/entitlement yet
    const isPaymentPending =
      !hasValidEntry &&
      myRegistrations.some((r) => r.paymentStatus === 'unpaid');

    return {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description ?? undefined,
      scheduledAt: lesson.scheduledAt,
      duration: lesson.duration,
      isListed: lesson.isListed,
      isRegistered,
      isPaymentPending,
      thumbnail: lesson.thumbnail
        ? supabaseService.getThumbnailUrl(
            lesson.thumbnail.bucket,
            lesson.thumbnail.path
          ).data
        : undefined,
      // Context-Aware Data
      isEligibleForFree,
      freeEligibilitiesUsed: usedInThisMonth,
    };
  });
}

const getUserLessons = async (
  user: User
): Promise<LiveLessonCardUserDashboardDTO[]> => {
  if (!user) {
    throw new AuthenticationError('');
  }

  const rawData = await db
    .select({
      lesson: liveLessons,
    })
    .from(liveLessons)
    .innerJoin(
      liveLessonsRegistrations,
      or(
        and(
          eq(liveLessonsRegistrations.lessonId, liveLessons.id),
          eq(liveLessonsRegistrations.userId, user.id),
          eq(liveLessonsRegistrations.accessMethod, 'paid_one_time'),
          eq(liveLessonsRegistrations.paymentStatus, 'paid')
        ),
        and(
          eq(liveLessonsRegistrations.lessonId, liveLessons.id),
          eq(liveLessonsRegistrations.userId, user.id),
          eq(liveLessonsRegistrations.accessMethod, 'subscription_entitlement')
        )
      )
    )
    .orderBy(asc(liveLessons.scheduledAt));

  return rawData.map(({ lesson }) => ({
    id: lesson.id,
    title: lesson.title,
    scheduledAt: lesson.scheduledAt,
    duration: lesson.duration,
    isListed: lesson.isListed,
    description: lesson.description ?? undefined,
    status:
      new Date(lesson.scheduledAt) > new Date()
        ? 'upcoming'
        : new Date(lesson.scheduledAt) <= new Date() && !lesson.isCompleted
          ? 'live'
          : 'completed',
    meetingUrl: lesson.meetingLink ?? undefined,
    recordingUrl: lesson.recordingUrl ?? undefined,
  }));
};

const notifyRegistrantsAboutRecording = async (
  lessonId: string,
  lessonTitle: string,
  recordingUrl: string
) => {
  const registrations = await db.query.liveLessonsRegistrations.findMany({
    columns: { name: true, email: true },
    where: and(
      eq(liveLessonsRegistrations.lessonId, lessonId),
      eq(liveLessonsRegistrations.paymentStatus, 'paid'),
      eq(liveLessonsRegistrations.accessMethod, 'paid_one_time')
    ),
  });

  if (!registrations.length) return;

  const recipientsData: CreateBatchOptions = registrations.map((r) => ({
    to: r.email,
    template: {
      id: templates.liveLesson.recordingAvailable,
      variables: {
        RECIPIENT_NAME: r.name,
        LIVE_LESSON_TITLE: lessonTitle,
        LIVE_LESSON_RECORDING_URL: recordingUrl,
      },
    },
  }));

  const { error } = await EmailService.sendBatch(recipientsData);
  if (error) {
    log.error({ message: 'Failed to send recording notifications', error });
  }
};

export const LiveLessonsService = {
  create,
  update,
  getMany,
  getLiveLessonsWithUserStatus,
  getUserLessons,
};
