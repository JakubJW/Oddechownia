import { getLessonBySlug } from '@/actions/lesson';
import AdminNewLesson from '@/features/admin/Lesson/LessonForm';
import { notFound } from 'next/navigation';

export default async function AdminEditLesson({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>;
}) {
  const { slug, lessonSlug } = await params;
  const lesson = await getLessonBySlug({ slug: lessonSlug });

  if (!lesson) {
    notFound();
  }

  return (
    <AdminNewLesson
      courseSlug={slug}
      lesson={lesson}
    />
  );
}
