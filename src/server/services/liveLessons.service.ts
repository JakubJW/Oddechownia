import { createformSchema } from '@/features/admin/LiveLesson/Form/schema';
import { and, asc, desc, eq, gt, gte, lt } from 'drizzle-orm';
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
import { AuthenticationError } from '../lib/errors';

const log = logger.child({ module: 'live-lessons' });

const create = async (values: z.infer<typeof createformSchema>) => {
  await db.insert(liveLessons).values({
    ...values,
  });
};

const update = async (id: string, values: z.infer<typeof createformSchema>) => {
  await db
    .update(liveLessons)
    .set({
      ...values,
    })
    .where(eq(liveLessons.id, id));
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
    currentParticipants: lesson.currentParticipants,
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
  const currentTimestamp = new Date();

  const rawData = await db
    .select({
      lesson: liveLessons,
      registration: liveLessonsRegistrations,
    })
    .from(liveLessons)
    .leftJoin(
      liveLessonsRegistrations,
      and(
        eq(liveLessonsRegistrations.lessonId, liveLessons.id),
        user ? eq(liveLessonsRegistrations.userId, user.id) : undefined
      )
    )
    .where(
      and(
        eq(liveLessons.isCompleted, false),
        gte(liveLessons.scheduledAt, currentTimestamp.toISOString())
      )
    )
    .orderBy(asc(liveLessons.scheduledAt));

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

  return rawData.map(({ lesson, registration }) => {
    const isRegistered = registration !== null;

    return {
      id: lesson.id,
      title: lesson.title,
      scheduledAt: lesson.scheduledAt,
      duration: lesson.duration,
      isListed: lesson.isListed,
      participantsCount: lesson.currentParticipants,
      isRegistered: isRegistered,
      ...eligibility,
      isPaymentPending: isRegistered && registration.paymentStatus === 'unpaid',
      registrationId: registration?.id,
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
      and(
        eq(liveLessonsRegistrations.lessonId, liveLessons.id),
        eq(liveLessonsRegistrations.userId, user.id)
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
    participantsCount: lesson.currentParticipants,
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

export const LiveLessonsService = {
  create,
  update,
  getMany,
  getLiveLessonsWithUserStatus,
  getUserLessons,
};
