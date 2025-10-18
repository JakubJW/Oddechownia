'use server';

import { createSlug } from '@/lib/utils';
import { db } from '@/db';
import { eq, asc, desc, inArray, and, max } from 'drizzle-orm';
import { playlistLesson, playlists } from '@/db/schema';
import { ActionResult } from './types';
import { BasePlaylist, Playlist } from '@/db/types';
import { notFound } from 'next/navigation';
import { filterService, PlaylistFilters } from '@/services/filters';
import { supabaseService } from '@/services/supabase';

interface ICreatePlaylist {
  name: string;
  description: string;
  isPublished: boolean;
  videoId?: number | null;
}

export const createPlaylist = async ({
  name,
  description,
  isPublished,
  videoId,
}: ICreatePlaylist): Promise<ActionResult<BasePlaylist>> => {
  try {
    const [lastPlaylist] = await db
      .select()
      .from(playlists)
      .orderBy(desc(playlists.position))
      .limit(1);

    const [playlist] = await db
      .insert(playlists)
      .values({
        name,
        description,
        isPublished,
        slug: createSlug(name),
        position: lastPlaylist ? lastPlaylist.position * 2 : 1024,
        videoId,
      })
      .returning();

    return { data: playlist, success: true, error: null };
  } catch (e) {
    console.error('Podczas tworzenia playlisty wystąpił błąd.', e);
    return {
      data: null,
      success: false,
      error:
        'Podczas tworzenia playlisty wystąpił błąd. Spróbuj ponownie później',
    };
  }
};

export const updatePlaylist = async (
  slug: string,
  payload: ICreatePlaylist
): Promise<ActionResult<BasePlaylist>> => {
  try {
    const [data] = await db
      .update(playlists)
      .set({
        ...payload,
      })
      .where(eq(playlists.slug, slug))
      .returning();

    return { data, success: true, error: null };
  } catch (error) {
    console.error(
      'Podczas edytowania playlisty wystąpił błąd. Spróbuj ponownie później.',
      error
    );
    return {
      data: null,
      success: false,
      error:
        'Podczas edytowania playlisty wystąpił błąd. Spróbuj ponownie później.',
    };
  }
};

export const getPublishedPlaylists = async (): Promise<
  ActionResult<BasePlaylist[]>
> => {
  try {
    const data = await db
      .select()
      .from(playlists)
      .where(eq(playlists.isPublished, true))
      .orderBy(asc(playlists.position));

    return { data, success: true, error: null };
  } catch (error) {
    console.error(
      'Podczas pobierania playlist wystąpił błąd. Spróbuj ponownie później.',
      error
    );
    return {
      data: null,
      success: false,
      error:
        'Podczas pobierania playlist wystąpił błąd. Spróbuj ponownie później.',
    };
  }
};

export const getPlaylists = async (
  filters: PlaylistFilters
): Promise<ActionResult<Playlist[]>> => {
  try {
    const where = filterService.buildWhereCondition(playlists, filters);
    const orderBy = filterService.buildOrderByClause(playlists, filters);

    const result = await db.query.playlists.findMany({
      with: {
        playlistLessons: {
          with: {
            lesson: true,
          },
        },
      },
      where,
      orderBy,
    });

    const data = result.map(({ playlistLessons, ...rest }) => {
      return {
        ...rest,
        lessons: playlistLessons.map((playlistLesson) => {
          return {
            ...playlistLesson.lesson,
            position: playlistLesson.position,
            playlistLessonId: playlistLesson.id,
          };
        }),
      };
    });

    return { data, success: true, error: null };
  } catch (error) {
    console.error(
      'Podczas pobierania playlist wystąpił błąd. Spróbuj ponownie później.',
      error
    );
    return {
      data: null,
      success: false,
      error:
        'Podczas pobierania playlist wystąpił błąd. Spróbuj ponownie później.',
    };
  }
};

export const getPlaylistsWithLessons = async (): Promise<
  ActionResult<Playlist[]>
> => {
  try {
    const data = await db.query.playlists.findMany({
      orderBy: [asc(playlists.position)],
      where: eq(playlists.isPublished, true),
      with: {
        playlistLessons: {
          orderBy: [asc(playlistLesson.position)],
          with: {
            lesson: {
              with: {
                video: true,
                thumbnail: true,
              },
            },
          },
        },
      },
    });

    const result = data.map(({ playlistLessons, ...rest }) => {
      return {
        ...rest,
        lessons: playlistLessons.map((playlistLesson) => {
          return {
            ...playlistLesson.lesson,
            position: playlistLesson.position,
            playlistLessonId: playlistLesson.id,
            thumbnailUrl: supabaseService.getFileUrl(
              playlistLesson.lesson.thumbnail.name,
              playlistLesson.lesson.thumbnail.bucket,
              playlistLesson.lesson.thumbnail.path
            ).data,
          };
        }),
      };
    });

    return { data: result, success: true, error: null };
  } catch (error) {
    console.error(
      'Podczas pobierania playlist wystąpił błąd. Spróbuj ponownie później.',
      error
    );
    return {
      data: null,
      success: false,
      error:
        'Podczas pobierania playlist wystąpił błąd. Spróbuj ponownie później.',
    };
  }
};

export const getBasePlaylist = async (
  filters: PlaylistFilters
): Promise<ActionResult<BasePlaylist>> => {
  try {
    const where = filterService.buildWhereCondition(playlists, filters);
    const [playlist] = await db.query.playlists.findMany({
      where,
    });

    return { data: playlist, error: null, success: true };
  } catch (error) {
    console.error('Podczas pobierania playlisty wystąpił błąd.', error);
    return {
      data: null,
      success: false,
      error: 'Podczas pobierania playlisty wystąpił błąd.',
    };
  }
};

export const getPlaylistBySlug = async (
  slug: string
): Promise<ActionResult<Playlist>> => {
  try {
    const data = await db.query.playlists.findFirst({
      where: (playlists, { eq }) => eq(playlists.slug, slug),
      with: {
        video: true,
        playlistLessons: {
          orderBy: [asc(playlistLesson.position)],
          with: {
            lesson: {
              with: {
                video: true,
                attachments: true,
              },
            },
          },
        },
      },
    });

    if (!data) {
      notFound();
    }

    const { playlistLessons, ...rest } = data;

    const result = {
      ...rest,
      lessons: playlistLessons.map((playlistLesson) => {
        return {
          ...playlistLesson.lesson,
          position: playlistLesson.position,
          playlistLessonId: playlistLesson.id,
        };
      }),
    };
    return { data: result, error: null, success: true };
  } catch (error) {
    console.error(
      'Podczas pobierania playlisty wystąpił błąd. Spróbuj ponownie później.',
      error
    );
    return {
      data: null,
      success: false,
      error:
        'Podczas pobierania playlisty wystąpił błąd. Spróbuj ponownie później.',
    };
  }
};

export const attachLessonsToPlaylist = async (
  slug: string,
  lessonIds: number[]
): Promise<ActionResult<null>> => {
  try {
    const playlist = await db.query.playlists.findFirst({
      where: eq(playlists.slug, slug),
    });

    if (!playlist) {
      return { data: null, success: false, error: 'Nie znaleziono playlisty.' };
    }

    await db.transaction(async (tx) => {
      const currentPlaylistLessons = await tx
        .select({ id: playlistLesson.lessonId })
        .from(playlistLesson)
        .where(eq(playlistLesson.playlistId, playlist.id));

      const currentLessonIdsInPlaylist = new Set(
        currentPlaylistLessons.map(({ id }) => id)
      );

      const lessonsToAdd = lessonIds.filter(
        (id) => !currentLessonIdsInPlaylist.has(id)
      );
      const lessonsToRemove = Array.from(currentLessonIdsInPlaylist).filter(
        (id) => !lessonIds.includes(id)
      );

      if (lessonsToRemove.length) {
        await tx
          .delete(playlistLesson)
          .where(
            and(
              eq(playlistLesson.playlistId, playlist.id),
              inArray(playlistLesson.lessonId, lessonsToRemove)
            )
          );
      }

      if (lessonsToAdd.length) {
        const [maxPositionResult] = await tx
          .select({
            maxPos: max(playlistLesson.position),
          })
          .from(playlistLesson)
          .where(eq(playlistLesson.playlistId, playlist.id));

        let currentMaxPosition = maxPositionResult.maxPos || 0;
        const BASE_POSITION_GAP = 1024;

        const insertions = lessonsToAdd.map((id) => {
          currentMaxPosition += BASE_POSITION_GAP;
          return {
            playlistId: playlist.id,
            lessonId: id,
            position: currentMaxPosition,
          };
        });

        await tx.insert(playlistLesson).values(insertions);
      }
    });

    return { data: null, success: true, error: null };
  } catch (error) {
    console.error(
      'Podczas dodawania lekcji do playlisty wystąpił błąd.',
      error
    );

    return {
      data: null,
      success: false,
      error: 'Podczas dodawania lekcji do playlisty wystąpił błąd.',
    };
  }
};
