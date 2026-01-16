import CreateDialog from '@/features/admin/LiveLesson/CreateDialog';
import { AdminLiveLessonsGrid } from '@/features/admin/LiveLesson/admin-live-lessons-grid';

export default function AdminLiveLessons() {
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Zajęcia na żywo</h2>
        <CreateDialog />
      </div>
      <AdminLiveLessonsGrid />
    </section>
  );
}
