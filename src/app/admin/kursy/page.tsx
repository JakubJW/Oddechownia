import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

const courses = [
  {
    id: 1,
  },
];

export default async function AdminCourses({}) {
  return (
    <>
      <div className="flex justify-between mb-8">
        <h1>Blog</h1>
        <Link
          href="/admin/kursy/dodaj-kurs"
          className={buttonVariants({ variant: 'default' })}
        >
          Dodaj kurs
        </Link>
      </div>
      {courses.length > 0 ? (
        // <CourseGrid
        //   courses={courses}
        //   isAdmin
        // />
        <div>tu są kursy</div>
      ) : (
        <div>
          <h3>Nie masz jeszcze żadnych kursów</h3>
        </div>
      )}
    </>
  );
}
