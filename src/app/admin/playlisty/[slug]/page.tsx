import { getPlaylistBySlug } from '@/actions/playlist';
import PlaylistForm from '@/features/admin/Playlist/Form/PlaylistForm';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';

export default async function AdminEditPlaylist({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data, success, error } = await getPlaylistBySlug(slug);

  if (!success) {
    return <ErrorMessage message={error} />;
  }

  return <PlaylistForm playlist={data} />;
}
