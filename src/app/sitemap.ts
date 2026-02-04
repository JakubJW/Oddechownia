import { db } from '@/server/db';
import { MetadataRoute } from 'next';
import { env } from '@/env';
import { playlists } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = env.NEXT_PUBLIC_APP_URL;

  const publishedPlaylists = await db.query.playlists.findMany({
    columns: { slug: true, updatedAt: true },
    where: eq(playlists.isPublished, true),
    with: {
      playlistLessons: {
        columns: {},
        with: {
          lesson: {
            columns: { slug: true, updatedAt: true },
          },
        },
      },
    },
  });

  const playlistUrls = publishedPlaylists.map(({ slug, updatedAt }) => ({
    url: `${baseUrl}/studio-jogi-online/${slug}`,
    lastModified: new Date(updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const lessonUrls = publishedPlaylists.flatMap(({ slug, playlistLessons }) =>
    playlistLessons.map(({ lesson }) => ({
      url: `${baseUrl}/studio-jogi-online/${slug}/${lesson.slug}`,
      lastModified: new Date(lesson.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  );

  return [
    {
      url: baseUrl,
      lastModified: '2026-02-01T21:10:41.134Z',
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/studio-jogi-online`,
      lastModified: '2026-02-01T21:10:41.134Z',
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/zajecia-na-zywo`,
      lastModified: '2026-02-01T21:10:41.134Z',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...playlistUrls,
    ...lessonUrls,
  ];
}
