import { IPlaylistsRepository } from '@/application/repositories/playlists.repository.interface';
import { Lesson } from '@/entities/models/lesson';
import { Playlist } from '@/entities/models/playlist';
import { db } from '@/server/db';
import { playlists } from '@/server/db/schema';
import { supabaseService } from '@/server/services/supabase.service';
import { eq } from 'drizzle-orm';

export class PlaylistsRepository implements IPlaylistsRepository {
  async getPublishedPlaylistsWithLessons(): Promise<
    Array<Playlist & { lessons: Lesson[] }>
  > {
    const result = await db.query.playlists.findMany({
      with: {
        playlistLessons: {
          with: {
            lesson: {
              with: {
                thumbnail: {
                  columns: {
                    path: true,
                    bucket: true,
                  },
                },
                video: {
                  columns: { duration: true },
                },
              },
            },
          },
        },
      },
      where: eq(playlists.isPublished, true),
    });

    return result.map(({ name, slug, isPublished, playlistLessons, id }) => ({
      id,
      name,
      slug,
      isPublished,
      lessons: playlistLessons.map(({ lesson }) => ({
        id: lesson.id,
        name: lesson.name,
        slug: lesson.slug,
        description: lesson.description,
        thumbnail: supabaseService.getThumbnailUrl(
          lesson.thumbnail.bucket,
          lesson.thumbnail.path
        ).data,
      })),
    }));
  }
}
