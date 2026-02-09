import { filterService, PlaylistFilters } from './filters.service';
import {
  playlistLesson,
  playlists,
  lessons,
  videos,
  files,
  userLessonProgress,
} from '@/server/db/schema';
import { and, asc, eq, inArray, InferSelectModel } from 'drizzle-orm';
import { db } from '../db';
import {
  PlaylistDetailDTO,
  AdminEditPlaylistDTO,
} from '../models/playlist.models';
import { transformVideoToDto } from './videos.service';
import { LessonsService } from './lessons.service';
import { LessonDetailDTO, LessonDTO } from '../models/lesson.models';
import { LessonLabelBaseSchema } from '../models/lessonLabel.models';
import { ProgressService } from './progress.service';

export type LessonWithVideoSelect = InferSelectModel<typeof lessons> & {
  video: InferSelectModel<typeof videos> | null;
  thumbnail: InferSelectModel<typeof files>;
  labels: LessonLabelBaseSchema[];
};

export type PlaylistLessonWithLessonSelect = InferSelectModel<
  typeof playlistLesson
> & {
  lesson: LessonWithVideoSelect;
};

export type PlaylistWithDeepLessonsSelect = InferSelectModel<
  typeof playlists
> & {
  video: InferSelectModel<typeof videos> | null;
  playlistLessons: PlaylistLessonWithLessonSelect[];
};

const transformToPlaylistDetailDto = (
  playlists: PlaylistWithDeepLessonsSelect[]
): PlaylistDetailDTO<LessonDTO[]>[] => {
  return playlists.map((playlist) => ({
    id: playlist.id,
    name: playlist.name,
    description: playlist.description,
    isAccessibleForFree: playlist.isAccessibleForFree,
    position: playlist.position,
    slug: playlist.slug,
    video: transformVideoToDto(playlist.video),
    lessons: playlist.playlistLessons.flatMap(({ lesson, position }) =>
      LessonsService.transformLessonToDTO([lesson], position)
    ),
    totalDurationInSeconds: playlist.playlistLessons.reduce(
      (total, { lesson }) => {
        return total + (lesson.video?.duration || 0);
      },
      0
    ),
  }));
};

const getPlaylistsListForUser = async (filters?: PlaylistFilters) => {
  const where = filterService.buildWhereCondition(playlists, filters);

  const result = await db.query.playlists.findMany({
    where,
    with: {
      video: true,
      playlistLessons: {
        orderBy: [asc(playlistLesson.position)],
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
            },
          },
        },
      },
    },
    orderBy: [asc(playlists.position)],
  });

  return transformToPlaylistDetailDto(result);
};

const transformSelectPlaylistToDTO = (
  playlist: SelectPlaylistResult,
  userId?: string
): PlaylistDetailDTO<LessonDetailDTO[]> | undefined => {
  if (!playlist) return undefined;

  return {
    id: playlist.id,
    name: playlist.name,
    description: playlist.description,
    slug: playlist.slug,
    position: playlist.position,
    lessons: playlist.playlistLessons.flatMap(({ lesson, position }) =>
      LessonsService.transformLessonsToDetailDTO([lesson], position, userId)
    ),
    video: transformVideoToDto(playlist.video),
    isAccessibleForFree: playlist.isAccessibleForFree,
    totalDurationInSeconds: playlist.playlistLessons.reduce(
      (total, { lesson }) => {
        return total + (lesson.video?.duration || 0);
      },
      0
    ),
  };
};

const selectPlaylist = async (filters?: PlaylistFilters) => {
  const where = filterService.buildWhereCondition(playlists, filters);

  const result = await db.query.playlists.findFirst({
    where,
    with: {
      video: true,
      playlistLessons: {
        orderBy: [asc(playlistLesson.position)],
        with: {
          lesson: {
            with: {
              video: true,
              thumbnail: true,
              userFavoriteLessons: true,
              attachments: {
                with: {
                  file: true,
                },
              },
              labels: {
                with: {
                  label: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return result;
};

const getPlaylist = async (userId?: string, filters?: PlaylistFilters) => {
  const result = await selectPlaylist(filters);

  if (!result) return undefined;

  const lessonIds = result.playlistLessons.map((pl) => pl.lessonId);

  let progressMap = undefined;
  if (userId) {
    const progressRecords = await db.query.userLessonProgress.findMany({
      where: and(
        eq(userLessonProgress.userId, userId),
        inArray(userLessonProgress.lessonId, lessonIds)
      ),
    });

    progressMap = new Map(progressRecords.map((p) => [p.lessonId, p]));
  }

  const transformed = transformSelectPlaylistToDTO(result, userId);

  if (!transformed) return undefined;

  return {
    ...transformed,
    lessons: transformed.lessons.map((lesson) => {
      return {
        ...lesson,
        progress: progressMap
          ? ProgressService.prepareProgress(progressMap, lesson)
          : undefined,
      };
    }),
  };
};

export type SelectPlaylistResult = Awaited<ReturnType<typeof selectPlaylist>>;

const getPlaylistMetadata = async (filters?: PlaylistFilters) => {
  const where = filterService.buildWhereCondition(playlists, filters);

  const result = await db.query.playlists.findFirst({
    where,
    columns: { name: true, description: true },
  });

  return result;
};

const selectPlaylistForAdminEdit = async (filters?: PlaylistFilters) => {
  const where = filterService.buildWhereCondition(playlists, filters);

  const result = await db.query.playlists.findFirst({
    where,
    with: {
      video: true,
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

  return result;
};

export type SelectAdminEditPlaylistResult = Awaited<
  ReturnType<typeof selectPlaylistForAdminEdit>
>;

const transformToAdminEditPlaylistDTO = (
  playlist: SelectAdminEditPlaylistResult
): AdminEditPlaylistDTO | undefined => {
  if (!playlist) return undefined;

  return {
    playlist: {
      slug: playlist.slug,
      position: playlist.position,
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      isPublished: playlist.isPublished,
      isAccessibleForFree: playlist.isAccessibleForFree,
    },
    lessons: LessonsService.transformPlaylistLessonsToAdminEditPlaylistDTO(
      playlist.playlistLessons
    ),
  };
};

const getPlaylistForAdminEdit = async (filters?: PlaylistFilters) => {
  const result = await selectPlaylistForAdminEdit(filters);

  return transformToAdminEditPlaylistDTO(result);
};

export const PlaylistsService = {
  getPlaylistsListForUser,
  getPlaylistMetadata,
  getPlaylist,
  getPlaylistForAdminEdit,
};
