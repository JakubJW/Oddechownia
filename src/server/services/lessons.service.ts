import { db } from '../db';
import {
  AdminLessonDTO,
  AdminLessonSchema,
  LessonBaseSchema,
  LessonDTO,
  LessonDetailDTO,
  LessonDetailSchema,
  LessonSchema,
  AdminEditPlaylistLessonDTO,
  AdminEditLessonDTO,
} from '../models/lesson.models';
import { filterService, LessonFilters } from './filters.service';
import { supabaseService } from './supabase.service';
import { transformVideoToDto } from './videos.service';
import { lessons, userFavoriteLessons, userLessonProgress } from '../db/schema';
import { AttachmentsService } from './attachments.service';
import { PlaylistLessonSchema } from '../models/playlistLesson.models';
import { VideoSchema } from '../models/video.models';
import { FileSchema } from '../models/file.models';
import { and, desc, eq, lt } from 'drizzle-orm';

const transformLessonToDTO = (
  lessons: LessonBaseSchema[],
  position: number
): LessonDTO[] => {
  return lessons.map((lesson) => ({
    id: lesson.id,
    name: lesson.name,
    description: lesson.description,
    slug: lesson.slug,
    position,
    thumbnail: supabaseService.getFileUrl(
      lesson.thumbnail.name,
      lesson.thumbnail.bucket,
      lesson.thumbnail.path
    ).data,
    video: transformVideoToDto(lesson.video),
    labels: lesson?.labels.map(({ label }) => ({
      id: label.id,
      text: label.text,
      color: label.color,
    })),
  }));
};

const transformLessonsToDetailDTO = (
  lessons: LessonDetailSchema[],
  userId: string,
  position: number
): LessonDetailDTO[] => {
  return lessons.map((lesson) => ({
    id: lesson.id,
    name: lesson.name,
    description: lesson.description,
    slug: lesson.slug,
    position,
    isFavorite: lesson.userFavoriteLessons.some(
      (favoriteLesson) =>
        favoriteLesson.lessonId === lesson.id &&
        favoriteLesson.userId === userId
    ),
    thumbnail: supabaseService.getFileUrl(
      lesson.thumbnail.name,
      lesson.thumbnail.bucket,
      lesson.thumbnail.path
    ).data,
    video: transformVideoToDto(lesson.video),
    attachments: AttachmentsService.transformAttachmentsToDTO(
      lesson.attachments
    ),
    labels: lesson.labels.map(({ label }) => ({
      id: label.id,
      text: label.text,
      color: label.color,
    })),
  }));
};

const transformAdminLessonListToDTO = (
  lessons: AdminLessonSchema[]
): AdminLessonDTO[] => {
  return lessons.map((lesson) => ({
    id: lesson.id,
    name: lesson.name,
    description: lesson.description,
    slug: lesson.slug,
    video: transformVideoToDto(lesson.video),
    thumbnail: supabaseService.getFileUrl(
      lesson.thumbnail.name,
      lesson.thumbnail.bucket,
      lesson.thumbnail.path
    ).data,
    playlists: lesson.playlistLessons.map(({ playlist }) => ({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      slug: playlist.slug,
      isAccessibleForFree: playlist.isAccessibleForFree,
    })),
    labels: lesson?.labels.map(({ label }) => ({
      id: label.id,
      text: label.text,
      color: label.color,
    })),
  }));
};

const getLessonMetadata = async (filters?: LessonFilters) => {
  const where = filterService.buildWhereCondition(lessons, filters);

  const result = await db.query.lessons.findFirst({
    where,
    columns: { name: true, description: true },
  });

  return result;
};

const getLessonsList = async (filters?: LessonFilters) => {
  const where = filterService.buildWhereCondition(lessons, filters);
  const orderBy = filterService.buildOrderByClause(lessons, filters);

  const result = await db.query.lessons.findMany({
    where,
    orderBy,
    with: {
      video: true,
      thumbnail: true,
      playlistLessons: {
        with: {
          playlist: true,
        },
      },
      labels: {
        with: {
          label: true,
        },
      },
    },
  });

  return transformAdminLessonListToDTO(result);
};

const transformPlaylistLessonsToAdminEditPlaylistDTO = (
  playlistLessons: Array<
    PlaylistLessonSchema & {
      lesson: LessonSchema & {
        videoId: number | null;
        video: VideoSchema | null;
        thumbnailId: number;
        thumbnail: FileSchema;
      };
    }
  >
): AdminEditPlaylistLessonDTO[] => {
  return playlistLessons.map(({ lesson, id, position }) => ({
    id: lesson.id,
    name: lesson.name,
    description: lesson.description,
    slug: lesson.slug,
    thumbnail: supabaseService.getFileUrl(
      lesson.thumbnail.name,
      lesson.thumbnail.bucket,
      lesson.thumbnail.path
    ).data,
    playlistLessonId: id,
    position,
  }));
};

const transformToAdminEditLessonDTO = (
  lesson: SelectLessonForAdminEdit
): AdminEditLessonDTO | undefined => {
  if (!lesson) return undefined;

  return {
    id: lesson.id,
    name: lesson.name,
    description: lesson.description,
    slug: lesson.slug,
    video: transformVideoToDto(lesson.video),
    thumbnail: supabaseService.getFileUrl(
      lesson.thumbnail.name,
      lesson.thumbnail.bucket,
      lesson.thumbnail.path
    ).data,
    attachments: AttachmentsService.transformToAdminEditLessonAttachmentDTO(
      lesson.attachments
    ),
    labels: lesson.labels.map(({ label }) => ({
      id: label.id,
      text: label.text,
      color: label.color,
    })),
  };
};

const selectLessonForAdminEdit = async (filters?: LessonFilters) => {
  const where = filterService.buildWhereCondition(lessons, filters);
  const orderBy = filterService.buildOrderByClause(lessons, filters);

  const result = await db.query.lessons.findFirst({
    where,
    with: {
      video: true,
      thumbnail: true,
      labels: {
        with: {
          label: true,
        },
      },
      attachments: {
        with: {
          file: true,
        },
      },
    },
    orderBy,
  });

  return result;
};

type SelectLessonForAdminEdit = Awaited<
  ReturnType<typeof selectLessonForAdminEdit>
>;

const getLessonForAdminEdit = async (filters?: LessonFilters) => {
  const result = await selectLessonForAdminEdit(filters);

  return transformToAdminEditLessonDTO(result);
};

const selectUserFavoriteLessons = async (
  userId: string,
  cursor: string | null,
  perPage: number
) => {
  const cursorCondition = undefined;

  if (cursor) {
    lt(userFavoriteLessons.createdAt, cursor);
  }

  const result = await db.query.userFavoriteLessons.findMany({
    where: and(eq(userFavoriteLessons.userId, userId), cursorCondition),
    limit: perPage,
    orderBy: desc(userFavoriteLessons.createdAt),
    with: {
      lesson: {
        with: {
          video: true,
          thumbnail: true,
          labels: {
            with: {
              label: true,
            },
          },
          playlistLessons: {
            with: {
              playlist: true,
            },
          },
        },
      },
    },
  });

  return result;
};

type SelectUserFavoriteLessons = Awaited<
  ReturnType<typeof selectUserFavoriteLessons>
>;

const transformToFavoriteLessonsDTO = (lessons: SelectUserFavoriteLessons) => {
  return lessons.map(({ createdAt, lesson }) => ({
    id: lesson.id,
    name: lesson.name,
    description: lesson.description,
    slug: lesson.slug,
    video: transformVideoToDto(lesson.video),
    thumbnail: supabaseService.getFileUrl(
      lesson.thumbnail.name,
      lesson.thumbnail.bucket,
      lesson.thumbnail.path
    ).data,
    createdAt,
    playlists: lesson.playlistLessons.map((lessonPlaylist) => ({
      ...lessonPlaylist.playlist,
    })),
    labels: lesson.labels.map(({ label }) => ({
      id: label.id,
      text: label.text,
      color: label.color,
    })),
  }));
};

const getUserFavoriteLessons = async (
  userId: string,
  cursor: string | null,
  perPage: number
) => {
  const result = await selectUserFavoriteLessons(userId, cursor, perPage);

  return transformToFavoriteLessonsDTO(result);
};

export const getRecentlyWatchedLessons = async (userId: string) => {
  const result = await db.query.userLessonProgress.findMany({
    where: eq(userLessonProgress.userId, userId),
    with: {
      lesson: {
        with: {
          labels: {
            with: {
              label: true,
            },
          },
          video: true,
          thumbnail: true,
        },
      },
      playlist: true,
    },
    orderBy: desc(userLessonProgress.updatedAt),
    limit: 3,
  });

  return result.map((item) => ({
    ...item.lesson,
    video: transformVideoToDto(item.lesson.video),
    thumbnail: supabaseService.getFileUrl(
      item.lesson.thumbnail.name,
      item.lesson.thumbnail.bucket,
      item.lesson.thumbnail.path
    ).data,
    progress: {
      isCompleted: item?.isCompleted || false,
      lastPositionSeconds: item.lastPositionSeconds,
      percent: Math.min(
        (item.lastPositionSeconds / item.lesson.video!.duration!) * 100,
        100
      ),
    },
    labels: item.lesson.labels.map(({ label }) => ({
      id: label.id,
      text: label.text,
      color: label.color,
    })),
    playlist: item.playlist,
  }));
};

export const LessonsService = {
  getLessonForAdminEdit,
  getLessonMetadata,
  transformLessonsToDetailDTO,
  transformLessonToDTO,
  getLessonsList,
  getRecentlyWatchedLessons,
  transformPlaylistLessonsToAdminEditPlaylistDTO,
  getUserFavoriteLessons,
};
