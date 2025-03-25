import AdminNewLesson from '@/features/admin/Course/LessonForm';
import { getLessonBySlug } from '../actions';

export default async function AdminEditLesson({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>;
}) {
  const { slug, lessonSlug } = await params;
  const lesson = await getLessonBySlug(lessonSlug);

  return (
    <AdminNewLesson
      courseSlug={slug}
      lesson={lesson}
    />
  );
}
