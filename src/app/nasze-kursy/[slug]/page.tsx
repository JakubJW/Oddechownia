import type { Metadata } from 'next';
import Container from '@/components/Container/Container';
import HeaderOne from '@/components/Headers/HeaderOne';
import { getCourseBySlug } from '@/actions/course';
import { buttonVariants } from '@/components/ui/button';
import { cn, formatDuration } from '@/lib/utils';
import { Film, Clock } from 'lucide-react';
import CourseVideoCard from '@/components/CourseVideoCard/CourseVideoCard';
import { notFound } from 'next/navigation';
import PurchaseCourseButton from '@/components/PurchaseCourseButton/PurchaseCourseButton';

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
  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  return (
    <section>
      <Container className="pt-16">
        <hgroup className="space-y-6">
          <HeaderOne className="font-semibold">{course.name}</HeaderOne>
          <p>{course?.description}</p>
          <div className="flex gap-4">
            {course.isOneOff && (
              <PurchaseCourseButton
                text={`Wykup dostęp za ${
                  course.priceInCents
                    ? (course.priceInCents / 100).toFixed(2)
                    : ''
                } zł`}
                endpoint={'/api/checkout/one-off'}
                payload={{
                  courseId: course.id,
                }}
              />
            )}
            <div
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'border-primaryBg'
              )}
            >
              <Film />
              <span>{course?.lessonCount} filmów</span>
            </div>
            <div
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'border-primaryBg'
              )}
            >
              <Clock />
              <span>{formatDuration(Math.floor(course.totalDuration))}</span>
            </div>
          </div>
        </hgroup>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-8 mt-16">
          {course.lessons.map(({ id, name, description, video }) => {
            return (
              <CourseVideoCard
                key={id}
                id={id}
                title={name}
                description={description}
                slug={slug}
                thumbnailUrl={`https://image.mux.com/${video?.publicPlaybackId}/thumbnail.jpg?width=640`}
                duration={video.duration}
                videoPlaybackId={video?.publicPlaybackId}
              />
            );
          })}
        </div>
      </Container>
    </section>
  );
}
