'use server';

import { createSlug } from '@/lib/utils';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { lessons } from '@/db/schema';
import { ActionResult } from './types';
import { Lesson, LessonWithPlaylistsWithVideo } from '@/db/types';
import { filterService, LessonFilters } from '@/services/filters';

interface CreateLesson {
  name: string;
  description: string;
  videoId: number | null;
}

export const createLesson = async ({
  name,
  description,
  videoId,
}: CreateLesson): Promise<ActionResult<Lesson>> => {
  try {
    const [lesson] = await db
      .insert(lessons)
      .values({
        name,
        description,
        slug: createSlug(name),
        videoId,
      })
      .returning();

    return { data: lesson, success: true, error: null };
  } catch (e) {
    console.error(
      'Podczas tworzenia lekcji wystąpił błąd. Spróbuj ponownie później.',
      e
    );
    return {
      data: null,
      success: false,
      error:
        'Podczas tworzenia lekcji wystąpił błąd. Spróbuj ponownie później.',
    };
  }
};

export const updateLesson = async (
  slug: string,
  { name, description }: CreateLesson
) => {
  try {
    const data = await db
      .update(lessons)
      .set({
        name,
        description,
        slug: createSlug(name),
      })
      .where(eq(lessons.slug, slug))
      .returning();

    return { data, error: null };
  } catch (e) {
    if (e instanceof Error) {
      console.error('Unable to update lesson', e.message);
      return { data: null, error: e.message };
    }

    return { data: null, error: 'Unable to update lesson' };
  }
};

export const getLessons = async (
  filters?: LessonFilters
): Promise<ActionResult<LessonWithPlaylistsWithVideo[]>> => {
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

export const getLesson = async (filters: LessonFilters) => {
  try {
    const lessonWhereClause = filterService.buildWhereCondition(
      lessons,
      filters
    );

    const data = await db.query.lessons.findFirst({
      ...(lessonWhereClause && { where: lessonWhereClause }),
      with: {
        video: true,
      },
    });

    return { data, success: true, error: null };
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
