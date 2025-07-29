import Container from '@/components/Container/Container';
import Carousel from '@/components/Carousel/Carousel';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import { getPlaylistsWithLessons } from '@/actions/playlist';
import LessonCard from '@/components/LessonCard/LessonCard';

export default async function OnlineYogaStudio() {
  const { data: playlists, success, error } = await getPlaylistsWithLessons();

  if (!success) {
    return <ErrorMessage message={error} />;
  }

  return (
    <section>
      <Container>
        {playlists.map((playlist) => (
          <div key={playlist.id}>
            <div>{playlist.name}</div>
            <Carousel key={playlist.id}>
              {playlist.lessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  name={lesson.name}
                  description={lesson.description}
                  video={lesson.video}
                />
              ))}
            </Carousel>
          </div>
        ))}
      </Container>
    </section>
  );
}
