import FavoriteLessonsGrid from '@/features/user/FavoriteLessonsGrid/FavoriteLessonsGrid';

export default async function FavoriteLessons() {
  return (
    <section>
      <p className="font-bold text-xl mb-4">Ulubione lekcje</p>
      <FavoriteLessonsGrid />
    </section>
  );
}
