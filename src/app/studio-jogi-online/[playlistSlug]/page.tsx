import Container from '@/components/Container/Container';
import { HeaderTwo } from '@/components/Headers/headers';
import LessonCard from '@/components/LessonCard/LessonCard';
import { Badge } from '@/components/ui/badge';
import VideoPlayer from '@/features/shared/VideoPlayer';
import { SchedulePlaylistButton } from '@/features/user/Calendar/SchedulePlaylistButton';
import { PlaylistsService } from '@/server/services/playlists.service';
import { Params } from '@/types/types';
import { CirclePlay } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: Params<{ playlistSlug: string }>;
}): Promise<Metadata> {
  const { playlistSlug } = await params;
  const metadata = await PlaylistsService.getPlaylistMetadata({
    slug: playlistSlug,
  });

  return {
    title: metadata
      ? `${metadata.name} | Studio Jogi Online | Oddechownia`
      : 'Studio Jogi Online | Oddechownia',
  };
}

export default async function Playlist({
  params,
}: {
  params: Params<{ playlistSlug: string }>;
}) {
  const { playlistSlug } = await params;
  const [playlist] = await PlaylistsService.getPlaylistsListForUser({
    slug: playlistSlug,
  });

  if (!playlist) {
    notFound();
  }

  return (
    <section>
      <Container className="pt-16">
        <div className="">
          {playlist.video && (
            <VideoPlayer
              playbackId={playlist.video.publicPlaybackId}
              videoSeries={playlist.name}
              videoTitle={playlist.name}
            />
          )}
          <hgroup className="space-y-6">
            <HeaderTwo>{playlist.name}</HeaderTwo>
            <p className="max-w-5xl">{playlist.description}</p>
            <div className="flex gap-4">
              <Badge variant="secondary">
                <CirclePlay className="h-4 w-4 mr-2" />
                <span>{playlist.lessons.length} lekcji</span>
              </Badge>
              <SchedulePlaylistButton playlist={playlist} />
            </div>
          </hgroup>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-8 mt-16">
          {playlist.lessons.map(
            ({ id, name, description, slug, thumbnail, video, labels }) => {
              return (
                <Link
                  key={id}
                  href={`/studio-jogi-online/${playlistSlug}/${slug}`}
                >
                  <LessonCard
                    video={video}
                    name={name}
                    description={description}
                    thumbnail={thumbnail}
                    labels={labels}
                  />
                </Link>
              );
            }
          )}
        </div>
      </Container>
    </section>
  );
}
