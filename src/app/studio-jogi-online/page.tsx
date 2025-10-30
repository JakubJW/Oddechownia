import Carousel from '@/components/Carousel/Carousel';
import Container from '@/components/Container/Container';
import LessonCard from '@/components/LessonCard/LessonCard';
import { PlaylistsService } from '@/server/services/playlists.service';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Studio Jogi Online | Oddechownia',
};

export default async function OnlineYogaStudio() {
  const playlists = await PlaylistsService.getPlaylistsListForUser({
    isPublished: true,
  });

  if (!playlists) {
    return (
      <section>
        <Container>
          <h1>Ups, coś poszło nie tak.</h1>
          {/* <ErrorMessage message={error} /> */}
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
                    thumbnail={lesson.thumbnail}
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
