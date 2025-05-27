import { getVideoByPlaybackId } from '@/actions/video';
import { getCourseBySlug, getCourses } from '@/actions/course';
import Container from '@/components/Container/Container';
import Playlist from '@/features/Lesson/Playlist';
import VideoPlayer from '@/features/Lesson/VideoPlayer';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Carousel from '@/components/Carousel/Carousel';
import CourseCard from '@/components/CourseCard/CourseCard';
import HeaderTwo from '@/components/Headers/HeaderTwo';

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

export default async function LessonVideo({
  params,
}: {
  params: Promise<{ playbackId: string; slug: string }>;
}) {
  const { playbackId, slug } = await params;
  const video = await getVideoByPlaybackId(playbackId);
  const course = await getCourseBySlug(slug);
  const courses = await getCourses();

  if (!video || !course || !courses) {
    notFound();
  }

  const currentLesson = course.lessons.find(
    (lesson) => lesson.video.publicPlaybackId === playbackId
  );

  return (
    <Container>
      <div className="grid grid-cols-12 gap-x-6 gap-y-16">
        <div className="col-span-8">
          <VideoPlayer playbackId={video.publicPlaybackId || undefined} />
          <hgroup className="space-y-4">
            <h1 className="font-bold text-2xl">{currentLesson?.name}</h1>
            <p className="text-gray-500">{currentLesson?.description}</p>
          </hgroup>
        </div>
        <div className="col-span-4 flex">
          <Playlist
            currentPlaybackId={video.publicPlaybackId || undefined}
            heading={course.name}
            lessons={course.lessons}
            courseSlug={course.slug}
          />
        </div>
        <div className="col-span-12">
          <HeaderTwo className="xl:text-3xl text-primaryFg mb-8">Sprawdź pozostałe kursy</HeaderTwo>
          <Carousel>
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
                  disabled={false}
                  isOneOff={isOneOff}
                  priceInCents={priceInCents}
                />
              )
            )}
          </Carousel>
        </div>
      </div>
    </Container>
  );
}
