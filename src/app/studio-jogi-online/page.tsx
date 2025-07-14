import Container from '@/components/Container/Container';
import Carousel from '@/components/Carousel/Carousel';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import { getPublishedPlaylists } from '@/actions/playlist';

export default async function OnlineYogaStudio() {
  const { data: playlists, success, error } = await getPublishedPlaylists();

  if (!success) {
    return <ErrorMessage message={error} />;
  }

  return (
    <section>
      <Container>
        {playlists.map((playlist) => (
          <>
            <div>{playlist.name}</div>
            <Carousel key={playlist.id}></Carousel>
          </>
        ))}
      </Container>
    </section>
  );
}
