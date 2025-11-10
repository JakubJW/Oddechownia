import { createformSchema } from '@/features/admin/LiveLesson/Form/schema';
import { z } from 'zod';
import { db } from '../db';
import { liveLessons } from '../db/schema';
import { and, eq, desc, lt, gte, asc } from 'drizzle-orm';
import { AdminLiveLessonRecordDTO } from '../models/liveLesson.models';

const create = async (values: z.infer<typeof createformSchema>) => {
  await db.insert(liveLessons).values({
    ...values,
    scheduledAt: `${values.date}T${values.time}`,
  });
};

const update = async (id: string, values: z.infer<typeof createformSchema>) => {
  await db
    .update(liveLessons)
    .set({
      ...values,
      scheduledAt: `${values.date}T${values.time}`,
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
  const result = await db.query.liveLessons.findMany({
    where: and(cursor ? lt(liveLessons.createdAt, cursor) : undefined),
    orderBy: desc(liveLessons.createdAt),
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

const getManyForLiveLessonsPage = async () => {
  const result = await db.query.liveLessons.findMany({
    where: and(
      eq(liveLessons.isCompleted, false),
      gte(liveLessons.scheduledAt, new Date().toISOString())
    ),
    orderBy: asc(liveLessons.scheduledAt),
  });

  return transformToAdminLiveLessonRecordListDTO(result);
};

export const LiveLessonsService = {
  create,
  update,
  getMany,
  getManyForLiveLessonsPage,
};
