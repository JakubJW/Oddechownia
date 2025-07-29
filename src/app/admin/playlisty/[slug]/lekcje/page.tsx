import { getLessons } from '@/actions/lesson';
import Filters from '@/components/Filters/Filters';
import { Params, SearchParams } from '@/types/types';
import LessonTable from '@/features/admin/Lesson/LessonTable';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';

export default async function AdminPlaylistLessons({
  params,
  searchParams,
}: {
  params: Params<{ slug: string }>;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const { data, success, error } = await getLessons({ playlistProps: { slug }});

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
