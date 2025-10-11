import { getPlaylistBySlug } from '@/actions/playlist';
import { getVideoByPlaybackId } from '@/actions/video';
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
  params: Params<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug} | Studio Jogi Online | Oddechownia`,
  };
}

export default async function LessonVideo({
  params,
}: {
  params: Params<{ playbackId: string; slug: string }>;
}) {
  const { playbackId, slug } = await params;
  const video = await getVideoByPlaybackId(playbackId);
  const { data: playlist } = await getPlaylistBySlug(slug);

  if (!video || !playlist) {
    notFound();
  }

  const currentLesson = playlist.lessons.find(
    (lesson) => lesson?.video?.publicPlaybackId === playbackId
  );

  if (!currentLesson) {
    notFound();
  }

  return (
    <Container>
      <div className="grid grid-cols-12 gap-x-6 gap-y-16">
        <div className="col-span-12 row-start-1 md:col-span-8">
          <VideoPlayer playbackId={video.publicPlaybackId || undefined} />
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
              {playlist.lessons.map(({ id, video, name }) => (
                <Link
                  key={id}
                  href={`/studio-jogi-online/${playlist.slug}/video/${video?.publicPlaybackId}`}
                >
                  <PlaylistLesson
                    isActive={video?.publicPlaybackId === playbackId}
                  >
                    <PlaylistLessonImage
                      duration={video ? video.duration : null}
                      alt={`Miniaturka lekcji o tytule ${name}`}
                      src={`https://image.mux.com/${video?.publicPlaybackId}/thumbnail.jpg?width=640`}
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
