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
import { UserRoles } from '@/server/db/consts';
import { redirect } from 'next/navigation';

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

export default async function LessonVideo({
  params,
}: {
  params: Params<{ playlistSlug: string; lessonSlug: string }>;
}) {
  const user = await getUser();

  if (!user || user.role !== UserRoles.ADMIN) {
    redirect('/');
  }

  const { playlistSlug, lessonSlug } = await params;
  const playlist = await PlaylistsService.getPlaylist({
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

  return (
    <Container>
      <div className="grid grid-cols-12 gap-x-6 gap-y-16">
        <div className="col-span-12 row-start-1 md:col-span-8">
          <VideoPlayer
            thumbnail={currentLesson.thumbnail}
            playbackId={currentLesson.video?.publicPlaybackId}
            videoTitle={currentLesson.name}
          />
          <hgroup className="space-y-4">
            <h1 className="font-bold text-2xl">{currentLesson.name}</h1>
            <p className="text-gray-500">{currentLesson.description}</p>
          </hgroup>
          <Attachments attachments={currentLesson.attachments} />
        </div>
        <CommentsSection
          lessonId={currentLesson.id}
          className="col-span-12 md:col-span-8"
        />
        <div className="col-span-12 row-start-2 md:row-start-1 row-end-auto md:col-span-4 flex">
          <Playlist>
            <PlaylistName>{playlist.name}</PlaylistName>
            <PlaylistContent>
              {playlist.lessons.map(({ id, video, name, slug }) => (
                <Link
                  key={id}
                  href={`/studio-jogi-online/${playlist.slug}/video/${video?.publicPlaybackId}`}
                >
                  <PlaylistLesson isActive={slug === lessonSlug}>
                    <PlaylistLessonImage
                      duration={video?.duration}
                      alt={`Miniaturka lekcji o tytule ${name}`}
                      src={currentLesson.thumbnail}
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
