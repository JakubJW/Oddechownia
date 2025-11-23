import { InferSelectModel } from 'drizzle-orm';
import { playlists } from '../db/schema';
import { VideoDTO } from './video.models';
import { AdminEditPlaylistLessonDTO } from './lesson.models';

export type PlaylistSchema = InferSelectModel<typeof playlists>;
export type PlaylistBaseDTO = Omit<
  PlaylistSchema,
  'videoId' | 'createdAt' | 'updatedAt' | 'isPublished'
>;
export type PlaylistDTO = PlaylistBaseDTO;

export type PlaylistDetailDTO<T> = PlaylistBaseDTO & {
  video?: VideoDTO;
  lessons: T;
  totalDurationInSeconds: number;
};

export type AdminPlaylistDTO = PlaylistBaseDTO & {
  video?: VideoDTO;
  isPublished: boolean;
};

export type AdminEditPlaylistDTO = {
  playlist: PlaylistBaseDTO & { video?: VideoDTO; isPublished: boolean };
  lessons: AdminEditPlaylistLessonDTO[];
};
