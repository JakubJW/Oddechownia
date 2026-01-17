import { InferSelectModel } from 'drizzle-orm';
import { lessons } from '../db/schema';
import { VideoDTO, VideoSchema } from './video.models';
import { AttachmentDTO, AttachmentSchema } from './attachment.models';
import { FileSchema } from './file.models';
import { PlaylistDTO, PlaylistSchema } from './playlist.models';
import { PlaylistLessonSchema } from './playlistLesson.models';
import { UserFavoriteLessonsSchema } from './userFavoriteLessons.models';
import { LessonLabelBaseSchema } from './lessonLabel.models';
import { LabelDTO } from './lessonLabel.models';
import z from 'zod';
import { nonEmptyString } from '@/shared/formUtils';

export type LessonSchema = InferSelectModel<typeof lessons>;
export type LessonBaseSchema = LessonSchema & {
  video: VideoSchema | null;
  thumbnail: FileSchema;
  labels: LessonLabelBaseSchema[];
};

export type LessonDetailSchema = LessonSchema & {
  video: VideoSchema | null;
  thumbnail: FileSchema;
  attachments: AttachmentSchema[];
  userFavoriteLessons: UserFavoriteLessonsSchema[];
  labels: LessonLabelBaseSchema[];
};

export type LessonBaseDTO = Omit<
  LessonSchema,
  'videoId' | 'createdAt' | 'updatedAt' | 'thumbnailId'
>;

export type LessonDTO = LessonBaseDTO & {
  video?: VideoDTO;
  position?: number;
  thumbnail: string;
  labels: LabelDTO[];
};

export type LessonDetailDTO = LessonBaseDTO & {
  video?: VideoDTO;
  position?: number;
  thumbnail: string;
  attachments: AttachmentDTO[];
  isFavorite: boolean;
  labels: LabelDTO[];
};

export type AdminLessonSchema = LessonSchema & {
  video: VideoSchema | null;
  thumbnail: FileSchema;
  playlistLessons: Array<PlaylistLessonSchema & { playlist: PlaylistSchema }>;
  labels: LessonLabelBaseSchema[];
};

export type AdminLessonDTO = LessonBaseDTO & {
  createdAt: string;
  video?: VideoDTO;
  thumbnail: string;
  playlists: Omit<PlaylistDTO, 'position'>[];
  labels: LabelDTO[];
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
  // attachments: AdminEditLessonAttachmentDTO[];
  labels: LabelDTO[];
};

export type FetchFavoriteLessonsResponse = {
  data: AdminLessonDTO[];
  nextCursor: string | null;
  success: boolean;
  error: string | null;
};

export type FetchAdminLessonListResponse = {
  data: AdminLessonDTO[];
  nextCursor: string | null;
  success: boolean;
  error: string | null;
};

export const craeteLessonSchema = z.object({
  thumbnailId: z.coerce
    .number({
      invalid_type_error: 'Nieprawidłowe ID miniatury.',
    })
    .int('ID miniatury musi być liczbą całkowitą.')
    .refine((value) => value !== undefined, 'Brak ID miniatury.')
    .optional(),
  name: z.string({ message: 'Pole wymagane' }).pipe(nonEmptyString),
  description: z.string(),
  videoId: z.coerce
    .number({
      invalid_type_error: 'Nieprawidłowe ID filmu.',
    })
    .int('ID filmu musi być liczbą całkowitą.')
    .optional(),
  labelIds: z.array(z.number()),
});

export type CreateLessonValues = z.infer<typeof craeteLessonSchema>;
export type UpdateLessonValues = z.infer<typeof craeteLessonSchema>;
