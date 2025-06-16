import Container from '@/components/Container/Container';
import HeaderOne from '@/components/Headers/HeaderOne';
import { getCourses } from '@/actions/course';
import CourseGrid from '@/components/CourseGrid';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Metadata } from 'next';
import Link from 'next/link';
import { getProfile } from '@/actions/profile';

export const metadata: Metadata = {
  title: 'Nasze kursy | Oddechownia',
};

export default async function CoursesLibrary() {
  const profile = await getProfile();
  const courses = await getCourses({ published: true });

  return (
    <section>
      <Container className="pt-16">
        <hgroup
          className={cn(!profile ? 'text-start' : 'text-center', 'space-y-6')}
        >
          <HeaderOne className="font-semibold">
            Rozpocznij swoją <span className="text-primaryFg">podróż</span>
          </HeaderOne>
          <p>
            Przeglądaj naszą bogatą kolekcję kursów jogi online, przygotowanych
            przez doświadczonych instruktorów.
          </p>
          {!profile && (
            <Link
              href={'/dolacz-do-nas'}
              className={cn(buttonVariants({ size: 'lg' }))}
            >
              Uzyskaj dostęp już od 25,99 zł/mies.
            </Link>
          )}
        </hgroup>
        <div className="grid grid-cols-12 mt-32">
          <div className="col-span-12 lg:col-span-2"></div>
          <CourseGrid
            courses={courses}
            user={profile}
          />
        </div>
      </Container>
    </section>
  );
}
