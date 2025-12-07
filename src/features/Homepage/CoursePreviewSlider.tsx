import HeaderTwo from '@/components/Headers/HeaderTwo';
import Carousel from '@/components/Carousel/Carousel';
import LessonCard from '@/components/LessonCard/LessonCard';
import Container from '@/components/Container/Container';
import { LessonsService } from '@/server/services/lessons.service';
import Link from 'next/link';

export default async function CourseVideosPreview() {
  const lessons = await LessonsService.getLessonsList({
    id: [64, 54, 96, 78, 23, 90, 16, 25, 66],
  });

  return (
    <section className="bg-gradient-to-b from-white to-primary-foreground">
      <Container>
        <div className="max-w-[600px] space-y-6 mb-24">
          <HeaderTwo>Wyrusz w duchową podróż</HeaderTwo>
        </div>
        <Carousel>
          {lessons.map((lesson) => (
            <Link
              key={lesson.id}
              className="h-full"
              href={`/studio-jogi-online/${lesson.playlists[0].slug}/${lesson.slug}`}
            >
              <LessonCard
                key={lesson.id}
                thumbnail={lesson.thumbnail}
                name={lesson.name}
                description={lesson.description}
                video={lesson.video}
                labels={lesson.labels}
              />
            </Link>
          ))}
        </Carousel>
      </Container>
    </section>
  );
}
