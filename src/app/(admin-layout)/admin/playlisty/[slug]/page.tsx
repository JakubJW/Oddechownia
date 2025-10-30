import PlaylistForm from '@/features/admin/Playlist/Form/PlaylistForm';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import LessonList from '@/features/admin/Lesson/LessonList';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PlaylistsService } from '@/server/services/playlists.service';

export default async function AdminEditPlaylist({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // const { data, success, error } = await getPlaylistBySlug(slug);

  const result = await PlaylistsService.getPlaylistForAdminEdit({ slug });

  if (!result) {
    return (
      <ErrorMessage message={'Podczas pobierania playlisty wystąpił błąd.'} />
    );
  }

  return (
    <div className="grid grid-cols-2">
      <PlaylistForm playlist={result.playlist} />
      <div className="flex flex-col gap-4 max-w-lg">
        <h2>Ustaw kolejność</h2>
        <LessonList
          lessons={result.lessons}
          courseSlug={slug}
        />
        <Link
          className={cn(buttonVariants({ variant: 'default' }))}
          href={`/admin/playlisty/${slug}/lekcje`}
        >
          Dodaj lekcje
        </Link>
      </div>
    </div>
  );
}
