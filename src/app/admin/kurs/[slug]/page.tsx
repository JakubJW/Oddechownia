import { getCourseBySlug } from '@/actions/course';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { notFound } from 'next/navigation';
import CourseForm from '@/features/admin/Course/CourseForm';
import LessonList from '@/features/admin/Lesson/LessonList';

export default async function AdminCourse({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const { lessons } = course;

  return (
    <>
      <div className="grid grid-cols-2">
        <CourseForm course={course} />

        {course && (
          <div className="flex flex-col gap-4 max-w-lg">
            <h2>Lekcje</h2>
            <LessonList
              lessons={lessons}
              courseSlug={slug}
            />
            <Link
              className={cn(buttonVariants({}))}
              href={`/admin/kurs/${slug}/lekcje/dodaj`}
            >
              Dodaj lekcję
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
