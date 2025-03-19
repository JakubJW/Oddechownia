import type { Metadata } from 'next';
import Container from '@/components/Container/Container';
import HeaderOne from '@/components/Headers/HeaderOne';
import { mockCourses, mockVideos } from './mocks';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Film, Clock } from 'lucide-react';
import CourseVideoCard from '@/components/CourseVideoCard/CourseVideoCard';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug} | Oddechownia`,
  };
}

export default async function Course({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = mockCourses.find((course) => course.slug === slug);

  return (
    <section>
      <Container className="pt-16">
        <hgroup className="space-y-6">
          <HeaderOne className="font-semibold">{course?.title}</HeaderOne>
          <p>{course?.description}</p>
          <div className="flex gap-4">
            <div
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'border-primaryBg'
              )}
            >
              <Film /> <span>{course?.totalVideos} filmów</span>
            </div>
            <div
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'border-primaryBg'
              )}
            >
              <Clock /> <span>{course?.totalDuration}</span>
            </div>
          </div>
        </hgroup>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-8 mt-16">
          {mockVideos.map(
            ({ id, title, description, slug, thumbnailUrl, totalDuration }) => (
              <CourseVideoCard
                key={id}
                id={id}
                title={title}
                description={description}
                slug={slug}
                thumbnailUrl={thumbnailUrl}
                totalDuration={totalDuration}
              />
            )
          )}
        </div>
      </Container>
    </section>
  );
}
