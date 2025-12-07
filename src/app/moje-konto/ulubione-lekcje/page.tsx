import FavoriteLessonsGrid from '@/features/user/FavoriteLessonsGrid/FavoriteLessonsGrid';

export default async function FavoriteLessons() {
  return (
    <section className="h-full">
      <p className="font-bold text-xl mb-4">Twoje ulubione lekcje</p>
      <FavoriteLessonsGrid />
    </section>
  );
}
