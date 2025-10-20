import Container from '@/components/Container/Container';
import Carousel from '@/components/Carousel/Carousel';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import { getPlaylistsWithLessons } from '@/server/actions/playlist';
import LessonCard from '@/components/LessonCard/LessonCard';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Studio Jogi Online | Oddechownia',
};

export default async function OnlineYogaStudio() {
  const { data: playlists, success, error } = await getPlaylistsWithLessons();

  if (!success) {
    return (
      <section>
        <Container>
          <h1>Ups, coś poszło nie tak.</h1>
          <ErrorMessage message={error} />
        </Container>
      </section>
    );
  }

  return (
    <section>
      <Container>
        {playlists.map((playlist) => (
          <div key={playlist.id}>
            <div className="flex justify-between">
              <div>{playlist.name}</div>
              <Link href={`/studio-jogi-online/${playlist.slug}`}>
                Zobacz wszystkie
              </Link>
            </div>
            <Carousel key={playlist.id}>
              {playlist.lessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  href={`/studio-jogi-online/${playlist.slug}/${lesson.slug}`}
                >
                  <LessonCard
                    thumbnailUrl={lesson.thumbnailUrl}
                    key={lesson.id}
                    name={lesson.name}
                    description={lesson.description}
                    video={lesson.video}
                  />
                </Link>
              ))}
            </Carousel>
          </div>
        ))}
      </Container>
    </section>
  );
}
