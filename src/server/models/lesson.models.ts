import { InferSelectModel } from 'drizzle-orm';
import { lessons } from '../db/schema';
import { VideoDTO, VideoSchema } from './video.models';
import {
  AdminEditLessonAttachmentDTO,
  AttachmentDTO,
  AttachmentSchema,
} from './attachment.models';
import { FileSchema } from './file.models';
import { PlaylistDTO, PlaylistSchema } from './playlist.models';
import { PlaylistLessonSchema } from './playlistLesson.models';
import { UserFavoriteLessonsSchema } from './userFavoriteLessons.models';

export type LessonSchema = InferSelectModel<typeof lessons>;
export type LessonBaseSchema = LessonSchema & {
  video: VideoSchema | null;
  thumbnail: FileSchema;
};

export type LessonDetailSchema = LessonSchema & {
  video: VideoSchema | null;
  thumbnail: FileSchema;
  attachments: AttachmentSchema[];
  userFavoriteLessons: UserFavoriteLessonsSchema[];
};

export type LessonBaseDTO = Omit<
  LessonSchema,
  'videoId' | 'createdAt' | 'updatedAt' | 'thumbnailId'
>;

export type LessonDTO = LessonBaseDTO & {
  video?: VideoDTO;
  position?: number;
  thumbnail: string;
};

export type LessonDetailDTO = LessonBaseDTO & {
  video?: VideoDTO;
  position?: number;
  thumbnail: string;
  attachments: AttachmentDTO[];
  isFavorite: boolean;
};

export type AdminLessonSchema = LessonSchema & {
  video: VideoSchema | null;
  thumbnail: FileSchema;
  playlistLessons: Array<PlaylistLessonSchema & { playlist: PlaylistSchema }>;
};

export type AdminLessonDTO = LessonBaseDTO & {
  video?: VideoDTO;
  thumbnail: string;
  playlists: Omit<PlaylistDTO, 'position'>[];
};

export type AdminLessonWithinPlaylistDTO = LessonBaseDTO & {
  video?: VideoDTO;
  thumbnail: string;
  position: number;
  playlistLessonId: number;
};

export type AdminEditPlaylistLessonDTO = LessonBaseDTO & {
  position: number;
  video?: VideoDTO;
  thumbnail: string;
  playlistLessonId: number;
};

export type AdminEditLessonDTO = LessonBaseDTO & {
  video?: VideoDTO;
  thumbnail: string;
  attachments: AdminEditLessonAttachmentDTO[];
};

export type FetchFavoriteLessonsResponse = {
  data: AdminLessonDTO[];
  nextCursor: string | null;
  success: boolean;
  error: string | null;
};
