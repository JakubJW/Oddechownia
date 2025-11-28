import Container from '@/components/Container/Container';
import {
  Playlist,
  PlaylistContent,
  PlaylistLesson,
  PlaylistLessonImage,
  PlaylistLessonName,
  PlaylistName,
} from '@/components/PlaylistLesson/PlaylistLesson';
import Attachments from '@/features/PlayLessonView/Attachments/Attachments';
import { CommentsSection } from '@/features/PlayLessonView/Comments/CommentsSection';
import VideoPlayer from '@/features/shared/VideoPlayer';
import { Params } from '@/types/types';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PlaylistsService } from '@/server/services/playlists.service';
import { LessonsService } from '@/server/services/lessons.service';
import { getUser } from '@/server/actions/user';
import { redirect } from 'next/navigation';
import FavoritesButton from '@/features/PlayLessonView/Actions/FavoritesButton';
import { AddToCalendarButton } from '@/features/user/Calendar/AddToCalendarButton';

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
  };
}

export default async function PlaylistLessonPlayback({
  params,
}: {
  params: Params<{ playlistSlug: string; lessonSlug: string }>;
}) {
  const user = await getUser();

  const { playlistSlug, lessonSlug } = await params;
  const playlist = await PlaylistsService.getPlaylist(user, {
    slug: playlistSlug,
  });

  if (!playlist) {
    notFound();
  }

  if (
    (!user && !playlist.isAccessibleForFree) ||
    (user && !user.hasActiveSubscription && user.role === 'user')
  ) {
    redirect('/dolacz-do-nas');
  }

  const currentLesson = playlist.lessons.find(
    (lesson) => lesson?.slug === lessonSlug
  );

  if (!currentLesson) {
    notFound();
  }

  return (
    <Container>
      <div className="grid grid-cols-12 gap-x-6 gap-y-16">
        <div className="col-span-12 row-start-1 md:col-span-8">
          <VideoPlayer
            thumbnail={currentLesson.thumbnail}
            playbackId={currentLesson.video?.publicPlaybackId}
            videoTitle={currentLesson.name}
          />
          <div className="space-y-4">
            <hgroup className="space-y-4">
              <div className="flex gap-4 items-start justify-between">
                <h1 className="font-bold text-2xl">{currentLesson.name}</h1>
                {user && (
                  <div className="flex gap-2">
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
              <p className="text-gray-500">{currentLesson.description}</p>
            </hgroup>
            <Attachments attachments={currentLesson.attachments} />
          </div>
        </div>
        <CommentsSection
          user={user}
          lessonId={currentLesson.id}
          className="col-span-12 md:col-span-8"
        />
        <div className="col-span-12 row-start-2 md:row-start-1 row-end-auto md:col-span-4 flex">
          <Playlist>
            <PlaylistName>{playlist.name}</PlaylistName>
            <PlaylistContent>
              {playlist.lessons.map(({ id, video, name, slug, thumbnail }) => (
                <Link
                  key={id}
                  href={`/studio-jogi-online/${playlist.slug}/${slug}`}
                >
                  <PlaylistLesson isActive={slug === lessonSlug}>
                    <PlaylistLessonImage
                      duration={video?.duration}
                      alt={name}
                      src={thumbnail}
                    />
                    <PlaylistLessonName>{name}</PlaylistLessonName>
                  </PlaylistLesson>
                </Link>
              ))}
            </PlaylistContent>
          </Playlist>
        </div>
      </div>
    </Container>
  );
}
