import { getLesson } from '@/server/actions/lesson';
import { getBasePlaylist, getPlaylistBySlug } from '@/server/actions/playlist';
import Container from '@/components/Container/Container';
import {
  Playlist,
  PlaylistContent,
  PlaylistLesson,
  PlaylistLessonImage,
  PlaylistLessonName,
  PlaylistName,
} from '@/components/PlaylistLesson/PlaylistLesson';
import Attachments from '@/features/Lesson/Attachments/Attachments';
import { CommentsSection } from '@/features/Lesson/Comments/CommentsSection';
import VideoPlayer from '@/features/Lesson/VideoPlayer';
import { Params } from '@/types/types';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: Params<{ playlistSlug: string; lessonSlug: string }>;
}): Promise<Metadata> {
  const { playlistSlug, lessonSlug } = await params;
  const { data: lessonData } = await getLesson({
    slug: lessonSlug,
  });
  const { data: playlistData } = await getBasePlaylist({ slug: playlistSlug });

  return {
    title: `${lessonData?.name} | ${playlistData?.name} | Studio Jogi Online | Oddechownia`,
  };
}

export default async function LessonVideo({
  params,
}: {
  params: Params<{ playlistSlug: string; lessonSlug: string }>;
}) {
  const { playlistSlug, lessonSlug } = await params;
  const { data: lesson, success: lessonSuccess } = await getLesson({
    slug: lessonSlug,
  });
  const { data: playlist } = await getPlaylistBySlug(playlistSlug);

  if (!lessonSuccess || !playlist) {
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
            thumbnailUrl={lesson.thumbnailUrl}
            playbackId={lesson?.video?.publicPlaybackId || undefined}
          />
          <hgroup className="space-y-4">
            <h1 className="font-bold text-2xl">{currentLesson?.name}</h1>
            <p className="text-gray-500">{currentLesson?.description}</p>
          </hgroup>
          <Attachments attachments={currentLesson.attachments} />
        </div>
        <div className="col-span-12 md:col-span-8">
          <CommentsSection lessonId={currentLesson.id} />
        </div>
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
                      duration={video ? video.duration : null}
                      alt={`Miniaturka lekcji o tytule ${name}`}
                      src={lesson.thumbnailUrl}
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
