import CreateDialog from '@/features/admin/LiveLesson/CreateDialog';
import LiveLessonsGrid from '@/features/admin/LiveLesson/LiveLessonsGrid';

export default function AdminLiveLessons() {
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Zajęcia na żywo</h2>
        <CreateDialog />
      </div>
      <LiveLessonsGrid />
    </section>
  );
}
