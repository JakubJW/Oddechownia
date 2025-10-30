import { InferSelectModel } from 'drizzle-orm';
import { playlistLesson } from '../db/schema';
import { LessonDTO } from './lesson.models';
import { PlaylistDTO } from './playlist.models';

export type PlaylistLessonSchema = InferSelectModel<typeof playlistLesson>;
export type PlaylistLessonBaseDTO = Omit<
  PlaylistLessonSchema,
  'lessonId' | 'playlistId'
>;

export type PlaylistLessonDTO = PlaylistLessonBaseDTO & {
  lesson: LessonDTO;
  playlist: PlaylistDTO;
};
