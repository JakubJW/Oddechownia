import Container from '@/components/Container/Container';
import FavoritesButton from '@/features/lesson-playback/Actions/FavoritesButton';
import { CommentsSection } from '@/features/lesson-playback/Comments/CommentsSection';
import LessonPlayer from '@/features/lesson-playback/LessonPlayer';
import { LessonsList } from '@/features/lesson-playback/lessons-list';
import { SubscriptionRequiredOverlay } from '@/features/lesson-playback/subscription-required-overlay';
import { ExpandableText } from '@/features/shared/expandable-text';
// import { AddToCalendarButton } from '@/features/user/Calendar/AddToCalendarButton';
import { getUser } from '@/server/actions/user';
import { signMuxPlaybackId } from '@/server/lib/mux';
import { LessonsService } from '@/server/services/lessons.service';
import { PlaylistsService } from '@/server/services/playlists.service';
import { Params } from '@/types/types';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

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
    title: `${lessonMetadata?.name} | ${playlistMetadata?.name} | Studio Jogi Online`,
    description: lessonMetadata?.description,
  };
}

export default async function PlaylistLessonPlayback({
  params,
}: {
  params: Params<{ playlistSlug: string; lessonSlug: string }>;
}) {
  const user = await getUser();

  const { playlistSlug, lessonSlug } = await params;
  const playlist = await PlaylistsService.getPlaylist(user?.id, {
    slug: playlistSlug,
  });

  if (!playlist) {
    notFound();
  }

  const currentLesson = playlist.lessons.find(
    (lesson) => lesson?.slug === lessonSlug
  );
  if (!currentLesson) {
    notFound();
  }
  const playbackToken = await signMuxPlaybackId(
    currentLesson.video!.privatePlaybackId!
  );
  const showPlayer =
    (user && user.hasActiveSubscription) || playlist.isAccessibleForFree;

  return (
    <Container className="pt-0 lg:py-16">
      <div className="flex flex-col lg:flex-row gap-6 mb-8 -mx-4 md:-mx-0">
        <div className="w-full lg:w-2/3">
          {showPlayer ? (
            <LessonPlayer
              signedPlaybackToken={playbackToken}
              thumbnail={currentLesson.thumbnail}
              playbackId={currentLesson.video?.privatePlaybackId}
              videoTitle={currentLesson.name}
              lessonId={currentLesson.id}
              playlistId={playlist.id}
              startTime={
                currentLesson.progress
                  ? currentLesson.progress.lastPositionSeconds
                  : 0
              }
            />
          ) : (
            <SubscriptionRequiredOverlay thumbnail={currentLesson.thumbnail} />
          )}
          <div className="space-y-4">
            <hgroup className="space-y-4 px-4 md:px-0">
              <div className="flex flex-col gap-4 items-start justify-between">
                <h1 className="text-md sm:text-xl font-medium">
                  {currentLesson.name}
                </h1>
                <ExpandableText text={currentLesson.description} />
                {user && (
                  <div className="flex w-full md:w-min gap-2">
                    {/* <AddToCalendarButton
                      lessonId={currentLesson.id}
                      playlistId={playlist.id}
                      lessonTitle={currentLesson.name}
                    />*/}
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
        <LessonsList
          className="w-full lg:w-1/3"
          playlistSlug={playlist.slug}
          playlistName={playlist.name}
          lessonSlug={lessonSlug}
          lessons={playlist.lessons}
        />
      </div>
      <CommentsSection
        user={user}
        lessonId={currentLesson.id}
        className="w-full lg:w-2/3"
      />
    </Container>
  );
}
