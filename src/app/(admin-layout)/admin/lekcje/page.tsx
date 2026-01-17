import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { AdminLessonsGrid } from '@/features/admin/Lesson/admin-lessons-grid';
import Filters from '@/components/Filters/Filters';
import CreateLessonDialog from '@/features/admin/Lesson/craete-dialog';

export default async function AdminLessons() {
  return (
    <div>
      <div className="flex justify-between">
        <p>Lekcje</p>
        <div className="flex gap-2">
          <CreateLessonDialog />
          <Link
            href="/admin/lekcje/etykiety"
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            Etykiety
          </Link>
        </div>
      </div>
      {/* <Filters
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
      /> */}
      <AdminLessonsGrid />
    </div>
  );
}
