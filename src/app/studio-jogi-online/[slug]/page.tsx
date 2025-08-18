import { getPlaylistBySlug } from '@/actions/playlist';
import Container from '@/components/Container/Container';
import CourseVideoCard from '@/components/CourseVideoCard/CourseVideoCard';
import HeaderOne from '@/components/Headers/HeaderOne';
import { buttonVariants } from '@/components/ui/button';
import VideoPlayer from '@/features/Lesson/VideoPlayer';
import { cn } from '@/lib/utils';
import { Params } from '@/types/types';
import { Film } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: Params<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug} | Studio Jogi Online | Oddechownia`,
  };
}

export default async function Playlist({
  params,
}: {
  params: Params<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: playlist } = await getPlaylistBySlug(slug);

  if (!playlist) {
    notFound();
  }

  return (
    <section>
      <Container className="pt-16">
        <div className="grid grid-cols-2 gap-8">
          <VideoPlayer
            playbackId={
              playlist.video
                ? playlist.video.publicPlaybackId ?? undefined
                : undefined
            }
            videoSeries={playlist.name}
            videoTitle={playlist.name}
          />
          <hgroup className="space-y-6">
            <HeaderOne className="font-semibold">{playlist.name}</HeaderOne>
            <p>{playlist.description}</p>
            <div className="flex gap-4">
              <div
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'border-primaryBg'
                )}
              >
                <Film />
                <span>{playlist.lessons.length} filmów</span>
              </div>
            </div>
          </hgroup>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-8 mt-16">
          {playlist.lessons.map(({ id, name, description, video }) => {
            return (
              <Link
                key={id}
                href={`/studio-jogi-online/${slug}/video/${video?.publicPlaybackId}`}
              >
                <CourseVideoCard
                  title={name}
                  description={description}
                  thumbnailUrl={`https://image.mux.com/${video?.publicPlaybackId}/thumbnail.jpg?width=640`}
                />
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
