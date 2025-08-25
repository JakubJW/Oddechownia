import AdminNewLesson from '@/features/admin/Lesson/LessonForm';
import { getLesson } from '@/actions/lesson';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';

export default async function AdminAddLesson({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data, success, error } = await getLesson({ slug });

  if (!success) {
    return <ErrorMessage message={error} />;
  }

  return <AdminNewLesson lesson={data} />;
}
