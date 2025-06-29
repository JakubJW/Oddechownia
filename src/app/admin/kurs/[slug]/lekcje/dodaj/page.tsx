import AdminNewLesson from '@/features/admin/Lesson/LessonForm';

export default async function AdminAddLesson({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>;
}) {
  const { slug } = await params;

  return <AdminNewLesson courseSlug={slug} />;
}
