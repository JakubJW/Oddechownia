import Container from '@/components/Container/Container';
import { PlaylistsService } from '@/server/services/playlists.service';
import { Metadata } from 'next';
import PlaylistCard from '@/components/PlaylistCard';
import { StudioJogiOnline } from '@/features/StudioJogiOnline/StudioJogiOnline';

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
      <Container className="py-12">
        <StudioJogiOnline playlists={playlists} />
      </Container>
    </section>
  );
}
