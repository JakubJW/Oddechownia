import Container from '@/components/Container/Container';
import Attachments from '@/features/PlayLessonView/Attachments/Attachments';
import { CommentsSection } from '@/features/PlayLessonView/Comments/CommentsSection';
import LessonPlayer from '@/features/PlayLessonView/LessonPlayer';
import { Params } from '@/types/types';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PlaylistsService } from '@/server/services/playlists.service';
import { LessonsService } from '@/server/services/lessons.service';
import { redirect } from 'next/navigation';
import FavoritesButton from '@/features/PlayLessonView/Actions/FavoritesButton';
import { AddToCalendarButton } from '@/features/user/Calendar/AddToCalendarButton';
import Image from 'next/image';
import { cn, formatDuration } from '@/lib/utils';
import { getRequiredUser } from '@/lib/data';
import { ProgressBar } from '@/features/shared/ProgressBar';
import { LessonLabel } from '@/components/LessonLabel';

export async function generateMetadata({
  params,
}: {
  params: Params<{ playlistSlug: string; lessonSlug: string }>;
}): Promise<Metadata> {
  const { playlistSlug, lessonSlug } = await params;

  const lessonMetadata = await LessonsService.getLessonMetadata({
    slug: lessonSlug,
  });
  const playlistMetadata = await PlaylistsService.getPlaylistMetadata({
    slug: playlistSlug,
  });

  return {
    title: `${lessonMetadata?.name} | ${playlistMetadata?.name} | Studio Jogi Online | Oddechownia`,
    description: lessonMetadata?.description,
  };
}

export default async function PlaylistLessonPlayback({
  params,
}: {
  params: Params<{ playlistSlug: string; lessonSlug: string }>;
}) {
  const user = await getRequiredUser();

  const { playlistSlug, lessonSlug } = await params;
  const playlist = await PlaylistsService.getPlaylist(user.id, {
    slug: playlistSlug,
  });

  if (!playlist) {
    notFound();
  }

  if (
    (!user && !playlist.isAccessibleForFree) ||
    (user && !user.hasActiveSubscription)
  ) {
    redirect('/logowanie');
  }

  const currentLesson = playlist.lessons.find(
    (lesson) => lesson?.slug === lessonSlug
  );

  if (!currentLesson) {
    notFound();
  }

  return (
    <Container className="py-4 md:py-4 lg:py-16">
      <div className="flex flex-col lg:flex-row gap-6 mb-8 -mx-4 md:-mx-0">
        <div className="w-full lg:w-2/3">
          <LessonPlayer
            thumbnail={currentLesson.thumbnail}
            playbackId={currentLesson.video?.publicPlaybackId}
            videoTitle={currentLesson.name}
            lessonId={currentLesson.id}
            playlistId={playlist.id}
            startTime={currentLesson.progress.lastPositionSeconds}
          />
          <div className="space-y-4">
            <hgroup className="space-y-4 px-4 md:px-0">
              <div className="flex flex-col gap-4 items-start justify-between">
                <h1 className="text-md md:text-xl font-bold ">
                  {currentLesson.name}
                </h1>
                <p className="text-sm md:text-md text-gray-500 line-clamp-2">
                  {currentLesson.description}
                </p>

                {user && (
                  <div className="flex w-full md:w-min gap-2">
                    <AddToCalendarButton
                      lessonId={currentLesson.id}
                      playlistId={playlist.id}
                      lessonTitle={currentLesson.name}
                    />
                    <FavoritesButton
                      lessonId={currentLesson.id}
                      initialIsFavorite={currentLesson.isFavorite}
                    />
                  </div>
                )}
              </div>
            </hgroup>
            {/* <Attachments attachments={currentLesson.attachments} /> */}
          </div>
        </div>
        <div className="w-full lg:w-1/3">
          <div className="flex flex-col flex-1 lg:h-0 lg:min-h-full md:border md:rounded-xl bg-white">
            <p className="font-semibold text-lg  p-6 line-clamp-2">
              {playlist.name}
            </p>
            <div className="flex-grow px-6 pb-6 overflow-y-scroll">
              {playlist.lessons.map(
                ({ id, video, name, slug, thumbnail, progress, labels }) => (
                  <Link
                    key={id}
                    href={`/studio-jogi-online/${playlist.slug}/${slug}`}
                  >
                    <div
                      className={cn(
                        'lesson-playlist-card flex gap-4 -mx-6 px-6 py-2 relative transition-colors duration-300',
                        slug === lessonSlug
                          ? 'bg-matcha/50'
                          : 'hover:bg-matcha/20'
                      )}
                    >
                      <div className="relative overflow-hidden rounded-lg flex-shrink-0">
                        <Image
                          src={thumbnail}
                          width={150}
                          height={96}
                          alt={name}
                          className="aspect-video transition-transform duration-300"
                        />
                        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs p-1 rounded-sm">
                          {formatDuration(video?.duration)}
                        </span>
                        <ProgressBar percent={progress.percent} />
                      </div>
                      <div className="flex flex-col">
                        <p
                          title={name}
                          className="text-sm md:text-md font-semibold line-clamp-2 mb-2"
                        >
                          {name}
                        </p>
                        <div className="flex gap-1">
                          {labels.map((label) => (
                            <LessonLabel
                              key={label.id}
                              label={{ text: label.text, color: label.color }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </div>
      <CommentsSection
        user={user}
        lessonId={currentLesson.id}
        className="w-full lg:w-2/3"
      />
    </Container>
  );
}
