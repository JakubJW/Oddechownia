import Container from '@/components/Container/Container';
import { PlaylistsService } from '@/server/services/playlists.service';
import { Metadata } from 'next';

import PlaylistCard from '@/components/PlaylistCard';

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
      <Container className="py-10">
        <div className="space-y-12">
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
