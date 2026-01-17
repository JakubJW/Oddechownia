'use server';

import { createSlug } from '@/lib/utils';
import { db } from '@/server/db';
import { and, eq, inArray } from 'drizzle-orm';
import { lessonLabels, lessons } from '@/server/db/schema';
import { ActionResult } from './types';
import { Lesson } from '@/server/db/types';
import {
  filterService,
  LessonFilters,
} from '@/server/services/filters.service';
import {
  CreateLessonValues,
  UpdateLessonValues,
} from '../models/lesson.models';

export const createLesson = async (values: CreateLessonValues) => {
  const [lesson] = await db
    .insert(lessons)
    .values({
      name: values.name,
      description: values.description,
      slug: createSlug(values.name),
      videoId: values.videoId,
      thumbnailId: values.thumbnailId!,
    })
    .returning();

  if (values.labelIds.length) {
    await db.insert(lessonLabels).values(
      values.labelIds.map((id) => ({
        lessonId: lesson.id,
        labelId: id,
      }))
    );
  }

  return lesson;
};

export const updateLesson = async (id: number, values: UpdateLessonValues) => {
  const updatedLesson = await db.transaction(async (tx) => {
    const currentLesson = await tx.query.lessons.findFirst({
      where: eq(lessons.id, id),
      columns: { thumbnailId: true, id: true },
      with: {
        labels: {
          with: {
            label: true,
          },
        },
      },
    });

    if (!currentLesson) throw new Error('Lekcja nie istnieje');

    const existingLabels = currentLesson.labels.map(({ labelId }) => labelId);
    const labelsToInsert = values.labelIds.filter(
      (id) => !existingLabels.includes(id)
    );
    const labelsToRemove = existingLabels.filter(
      (id) => !values.labelIds.includes(id)
    );

    if (labelsToInsert.length) {
      await db.insert(lessonLabels).values(
        labelsToInsert.map((id) => ({
          lessonId: currentLesson.id,
          labelId: id,
        }))
      );
    }

    if (labelsToRemove.length) {
      await db
        .delete(lessonLabels)
        .where(
          and(
            eq(lessonLabels.lessonId, currentLesson.id),
            inArray(lessonLabels.labelId, labelsToRemove)
          )
        );
    }

    const [updated] = await tx
      .update(lessons)
      .set({
        name: values.name,
        description: values.description,
        slug: createSlug(values.name),
        videoId: values.videoId,
        thumbnailId: values.thumbnailId,
      })
      .where(eq(lessons.id, id))
      .returning();

    return updated;
  });

  return updatedLesson;
};

export const getLessons = async (
  filters?: LessonFilters
): Promise<ActionResult<Lesson[]>> => {
  try {
    const where = filterService.buildWhereCondition(lessons, filters);
    const orderBy = filterService.buildOrderByClause(lessons, filters);

    const data = await db.query.lessons.findMany({
      where,
      orderBy,
      with: {
        video: true,
        playlistLessons: {
          with: {
            playlist: true,
          },
        },
      },
    });

    const result = data.map(({ playlistLessons, ...rest }) => {
      return {
        ...rest,
        playlists: playlistLessons.map(({ playlist }) => {
          return { ...playlist };
        }),
      };
    });

    return { data: result, success: true, error: null };
  } catch (e) {
    console.error(
      'Podczas pobierania lekcji wystąpił błąd. Spróbuj ponownie później.',
      e
    );
    return {
      data: null,
      success: false,
      error:
        'Podczas pobierania lekcji wystąpił błąd. Spróbuj ponownie później.',
    };
  }
};

export const removeLesson = async (id: number) => {
  try {
    await db.delete(lessons).where(eq(lessons.id, id));

    return { data: null, success: true, error: null };
  } catch (error) {
    console.error(
      'Podczas usuwania lekcji wystąpił błąd. Spróbuj ponownie później.',
      error
    );
    return {
      data: null,
      success: false,
      error: 'Podczas usuwania lekcji wystąpił błąd. Spróbuj ponownie później.',
    };
  }
};
