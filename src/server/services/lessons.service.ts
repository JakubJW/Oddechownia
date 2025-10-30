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
import { lessons } from '../db/schema';
import { AttachmentsService } from './attachments.service';
import { PlaylistLessonSchema } from '../models/playlistLesson.models';
import { VideoSchema } from '../models/video.models';
import { FileSchema } from '../models/file.models';

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
  }));
};

const transformLessonsToDetailDTO = (
  lessons: LessonDetailSchema[],
  position: number
): LessonDetailDTO[] => {
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
    attachments: AttachmentsService.transformAttachmentsToDTO(
      lesson.attachments
    ),
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
  };
};

const selectLessonForAdminEdit = async (filters?: LessonFilters) => {
  const where = filterService.buildWhereCondition(lessons, filters);

  const result = await db.query.lessons.findFirst({
    where,
    with: {
      video: true,
      thumbnail: true,
      attachments: {
        with: {
          file: true,
        },
      },
    },
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

export const LessonsService = {
  getLessonForAdminEdit,
  getLessonMetadata,
  transformLessonsToDetailDTO,
  transformLessonToDTO,
  getLessonsList,
  transformPlaylistLessonsToAdminEditPlaylistDTO,
};
