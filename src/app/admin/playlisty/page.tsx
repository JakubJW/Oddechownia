import { getPlaylists } from '@/actions/playlist';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import Playlists from '@/features/admin/Playlist/Playlists';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default async function AdminPlaylists() {
  const { data, error, success } = await getPlaylists();

  if (!success) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div>
      <div className='flex items-center justify-between'>
        <p>Playlisty</p>
        <Link
          href="/admin/playlisty/dodaj"
          className={cn(buttonVariants({ variant: 'default' }))}
        >
          Dodaj playlistę
        </Link>
      </div>
      <Playlists playlists={data} />
    </div>
  );
}
