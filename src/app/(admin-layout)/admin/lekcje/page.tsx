import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import LessonCard from '@/components/LessonCard/LessonCard';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import LessonGrid from '@/features/admin/Lesson/LessonGrid';
import { LessonFilters, SortOrder } from '@/server/services/filters.service';
import type { SearchParams } from '@/types/types';
import Filters from '@/components/Filters/Filters';
import { LessonsService } from '@/server/services/lessons.service';

export default async function AdminLessons({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query = await searchParams;
  const filters: LessonFilters = {};

  if (query['search']) {
    filters.search = query['search'] as string;
  }

  if (query['sortBy']) {
    filters.sortBy = query['sortBy'] as string;
  } else {
    filters.sortBy = 'name';
  }

  if (query['sortOrder']) {
    filters.sortOrder = query['sortOrder'] as SortOrder;
  }

  const lessons = await LessonsService.getLessonsList(filters);

  if (!lessons) {
    return (
      <ErrorMessage message={'Podczas pobierania lekcji wystąpił błąd.'} />
    );
  }

  return (
    <div>
      <div className="flex justify-between">
        <p>Lekcje</p>
        <div className="flex gap-2">
          <Link
            href="/admin/lekcje/dodaj"
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            Dodaj lekcję
          </Link>
          <Link
            href="/admin/lekcje/etykiety"
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            Etykiety
          </Link>
        </div>
      </div>
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
      <LessonGrid>
        {lessons.map(({ id, name, description, video, thumbnail }) => (
          <Link
            href={`/admin/lekcje/${id}`}
            key={id}
            className="hover:opacity-80"
          >
            <LessonCard
              thumbnail={thumbnail}
              name={name}
              video={video}
              description={description}
            />
          </Link>
        ))}
      </LessonGrid>
    </div>
  );
}
