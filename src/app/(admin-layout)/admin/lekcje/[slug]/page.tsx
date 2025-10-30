import AdminNewLesson from '@/features/admin/Lesson/LessonForm';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import { LessonsService } from '@/server/services/lessons.service';

export default async function AdminAddLesson({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = await LessonsService.getLessonForAdminEdit({ slug });

  if (!lesson) {
    return (
      <ErrorMessage message={'Podczas pobierania lekcji wystąpił błąd.'} />
    );
  }

  return <AdminNewLesson lesson={lesson} />;
}
