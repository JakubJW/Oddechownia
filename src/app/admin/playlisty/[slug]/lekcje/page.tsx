import { getLessons } from '@/server/actions/lesson';
import Filters from '@/components/Filters/Filters';
import { Params, SearchParams } from '@/types/types';
import LessonTable from '@/features/admin/Lesson/LessonTable';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import { LessonFilters, SortOrder } from '@/server/services/filters.service.';

export default async function AdminPlaylistLessons({
  params,
  searchParams,
}: {
  params: Params<{ slug: string }>;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const query = await searchParams;

  const filters: LessonFilters = {};

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

  const { data, success, error } = await getLessons({
    ...filters,
    playlistProps: { slug },
  });

  if (!success) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div>
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
      />
      <LessonTable
        lessons={data}
        playlistSlug={slug}
      />
    </div>
  );
}
