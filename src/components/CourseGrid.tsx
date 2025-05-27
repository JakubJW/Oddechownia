import Pagination from '@/components/Pagination/Pagination';
import CourseCard from '@/components/CourseCard/CourseCard';
import { CourseWithLessonsWithVideos } from '@/db/types';
import { User } from '@supabase/supabase-js';

interface CourseGridProps {
  courses: CourseWithLessonsWithVideos;
  user: User | null;
}

export default function CourseGrid({ courses, user }: CourseGridProps) {
  if (!courses) {
    return (
      <div className="col-span-12 lg:col-span-10 text-red-500 min-h-[300px]">
        Podczas ładowania kursów wystąpił błąd. Spróbuj ponownie później.
      </div>
    );
  }

  if (!courses.length) {
    return (
      <div className="col-span-12 lg:col-span-10 text-red-500 min-h-[300px]">
        Brak wyników.
      </div>
    );
  }

  return (
    <div className="col-span-12 lg:col-span-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-8">
        {courses.map(
          ({
            id,
            name,
            description,
            slug,
            lessonCount,
            totalDuration,
            lessons,
            isOneOff,
            priceInCents
          }) => (
            <CourseCard
              key={id}
              title={name}
              description={description}
              slug={slug}
              totalVideos={lessonCount}
              totalDuration={Math.round(totalDuration)}
              thumbnailUrl={`https://image.mux.com/${lessons[0]?.video?.publicPlaybackId}/thumbnail.jpg?width=640`}
              disabled={!user}
              isOneOff={isOneOff}
              priceInCents={priceInCents}
            />
          )
        )}
      </div>
      <div className="flex mt-8 justify-center col-span-1 sm:col-span-2 xl:col-span-3">
        <Pagination
          page={'1'}
          perPage={3}
          total={9}
          baseUrl="/nasze-kursy"
        />
      </div>
    </div>
  );
}
