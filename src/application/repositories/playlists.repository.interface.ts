import { Lesson } from '@/entities/models/lesson';
import { Playlist } from '@/entities/models/playlist';

export interface IPlaylistsRepository {
  getPublishedPlaylistsWithLessons(): Promise<
    Array<Playlist & { lessons: Lesson[] }>
  >;
}
