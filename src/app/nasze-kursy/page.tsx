import Container from '@/components/Container/Container';
import CourseCard from '@/components/CourseCard/CourseCard';
import HeaderOne from '@/components/Headers/HeaderOne';
import Pagination from '@/components/Pagination/Pagination';
import { buttonVariants } from '@/components/ui/button';
import { cn, formatDuration } from '@/lib/utils';
import { createClient } from '@/supabase/server';
import { Metadata } from 'next';
import Link from 'next/link';
import { getCourses } from '../admin/kursy/actions';

export const metadata: Metadata = {
  title: 'Nasze kursy | Oddechownia',
};

export default async function CoursesLibrary() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const courses = await getCourses();

  if (!courses) {
    return (
      <div className="text-red-500">
        Failed to load courses. Please try again later.
      </div>
    );
  }

  return (
    <section>
      <Container className="pt-16">
        <hgroup
          className={cn(!user ? 'text-start' : 'text-center', 'space-y-6')}
        >
          <HeaderOne className="font-semibold">
            Rozpocznij swoją <span className="text-primaryFg">podróż</span>
          </HeaderOne>
          <p>
            Przeglądaj naszą bogatą kolekcję kursów jogi online, przygotowanych
            przez doświadczonych instruktorów.
          </p>
          {!user && (
            <Link
              href={'/dolacz-do-nas'}
              className={cn(buttonVariants({ size: 'lg' }))}
            >
              Uzyskaj dostęp już od 25,99 zł/mies.
            </Link>
          )}
        </hgroup>
        <div className="grid grid-cols-12 mt-32">
          <div className="col-span-12 lg:col-span-2">es</div>
          <div className="col-span-12 lg:col-span-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-8">
              {courses.map(({ id, name, description, slug, lessonCount, totalDuration, lessons }) => (
                <CourseCard
                  key={id}
                  id={id}
                  title={name}
                  description={description}
                  slug={slug}
                  totalVideos={lessonCount}
                  totalDuration={formatDuration(Math.round(totalDuration))}
                  thumbnailUrl={`https://image.mux.com/${lessons[0]?.videos[0]?.publicPlaybackId}/thumbnail.jpg?width=640`}
                  disabled={!user}
                />
              ))}
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
        </div>
      </Container>
    </section>
  );
}
