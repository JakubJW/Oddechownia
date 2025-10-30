import { getAdminPlaylists } from '@/server/actions/playlist';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import Playlists from '@/features/admin/Playlist/Playlists';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Filters from '@/components/Filters/Filters';
import { SearchParams } from '@/types/types';
import { PlaylistFilters, SortOrder } from '@/server/services/filters.service';

export default async function AdminPlaylists({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query = await searchParams;
  const filters: PlaylistFilters = {};

  if (query['search']) {
    filters.search = query['search'] as string;
  }

  if (query['sortBy']) {
    filters.sortBy = query['sortBy'] as string;
  } else {
    filters.sortBy = 'position';
  }

  if (query['sortOrder']) {
    filters.sortOrder = query['sortOrder'] as SortOrder;
  } else {
    filters.sortOrder = 'asc' as SortOrder;
  }

  const { data, error, success } = await getAdminPlaylists(filters);

  if (!success) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div>
      <p>Playlisty</p>
      <Filters
        config={{
          search: true,
          sortOptions: [
            {
              name: 'sortBy',
              placeholder: 'Sortuj według',
              options: [
                { value: 'name', label: 'Nazwa' },
                { value: 'createdAt', label: 'Data utworzenia' },
                { value: 'updatedAt', label: 'Data modyfikacji' },
              ],
            },
            {
              name: 'sortOrder',
              placeholder: 'Kolejność',
              options: [
                { value: 'asc', label: 'Rosnąco' },
                { value: 'desc', label: 'Malejąco' },
              ],
            },
          ],
        }}
      >
        <Link
          href="/admin/playlisty/dodaj"
          className={cn(buttonVariants({ variant: 'default' }))}
        >
          Nowa playlista
        </Link>
      </Filters>
      <Playlists playlists={data} />
    </div>
  );
}
