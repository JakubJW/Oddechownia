import AdminNewLesson from '@/features/admin/Lesson/LessonForm';
import { getLesson } from '@/actions/lesson';

export default async function AdminAddLesson({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data, success, error } = await getLesson({ slug });

  return <AdminNewLesson lesson={data} />;
}
