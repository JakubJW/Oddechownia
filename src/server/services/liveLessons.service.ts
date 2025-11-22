import {
  createformSchema,
  updateFormSchema,
} from '@/features/admin/LiveLesson/Form/schema';
import { and, asc, eq, gt, or } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { liveLessons, liveLessonsRegistrations } from '../db/schema';
import { logger } from '../lib/logger.service';
import {
  AdminLiveLessonRecordDTO,
  LiveLessonCardDTO,
  LiveLessonCardUserDashboardDTO,
} from '../models/liveLesson.models';
import { LiveLessonsRegistrationsService } from './liveLessonsRegistrations.service';
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
  }));
};

const selectAdminLiveLessons = async (
  cursor: string | null,
  perPage: number = 6
) => {
  const cursorCondition = cursor
    ? gt(liveLessons.scheduledAt, cursor)
    : undefined;

  const result = await db.query.liveLessons.findMany({
    where: cursorCondition,
    orderBy: asc(liveLessons.scheduledAt),
    with: {
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

async function getLiveLessonsWithUserStatus(
  user: User
): Promise<LiveLessonCardDTO[]> {
  const lessons = await db.query.liveLessons.findMany({
    with: {
      registrations: user
        ? {
            where: eq(liveLessonsRegistrations.userId, user.id),
          }
        : undefined,
    },
    where: eq(liveLessons.isListed, false),
    orderBy: liveLessons.scheduledAt,
  });

  const { isEligible, lessonsUsed } =
    await LiveLessonsRegistrationsService.checkEntitlementEligibility(user);

  log.debug({
    method: 'getLiveLessonsWithUserStatus',
    message: isEligible
      ? `Is eligible for ${lessonsUsed ? 2 - lessonsUsed : 2} free live lessons`
      : 'Is not eligible for free live lessons.',
  });

  const eligibility = isEligible
    ? { isEligibleForFree: isEligible, freeEligibilitiesUsed: lessonsUsed }
    : { isEligibleForFree: isEligible, freeEligibilitiesUsed: lessonsUsed };

  return lessons.map((lesson) => {
    const myRegistrations =
      lesson.registrations?.filter((r) => r.userId === user?.id) || [];
    const isAlreadyPaid = myRegistrations.some(
      (r) => r.paymentStatus === 'paid'
    );
    const isPaymentPending =
      !isAlreadyPaid &&
      myRegistrations.some((r) => r.paymentStatus === 'unpaid');

    return {
      id: lesson.id,
      title: lesson.title,
      scheduledAt: lesson.scheduledAt,
      duration: lesson.duration,
      isListed: lesson.isListed,
      isRegistered: myRegistrations.length > 0,
      ...eligibility,
      isPaymentPending,
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
