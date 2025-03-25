import { getCourseBySlug } from '../../kursy/actions';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { notFound } from 'next/navigation';
import LessonCard from '@/features/admin/Lesson/LessonCard';
import CourseForm from '@/features/admin/Course/CourseForm';

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

  const lessons = course.lessons;

  return (
    <>
      <div className="grid grid-cols-2">
        <CourseForm course={course} />

        {course && (
          <div className="flex flex-col gap-4 max-w-lg">
            <h2>Lekcje</h2>
            {lessons.length ? (
              <div className="space-y-4">
                {lessons.map(({ id, name, description, slug: lessonSlug }) => (
                  <LessonCard
                    key={id}
                    name={name}
                    description={description}
                    imageUrl={`https://image.mux.com/${lessons[0].videos[0].publicPlaybackId}/thumbnail.jpg?width=640`}
                    href={`/admin/kurs/${slug}/lekcje/${lessonSlug}`}
                  />
                ))}
              </div>
            ) : (
              <p>Nie masz żadnych lekcji</p>
            )}
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
