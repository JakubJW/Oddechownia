import AdminNewLesson from '@/features/admin/Lesson/LessonForm';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import { LessonsService } from '@/server/services/lessons.service';

export default async function AdminAddLesson({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lesson = await LessonsService.getLessonForAdminEdit({ id: Number(id) });

  if (!lesson) {
    return (
      <ErrorMessage message={'Podczas pobierania lekcji wystąpił błąd.'} />
    );
  }

  return <AdminNewLesson lesson={lesson} />;
}
