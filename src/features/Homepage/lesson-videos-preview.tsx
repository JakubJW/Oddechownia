import { HeaderTwo, HeadingParagraph } from '@/components/Headers/headers';
import Container from '@/components/Container/Container';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import Carousel from '@/components/Carousel/Carousel';
import { ContentBlocksService } from '@/server/services/content-blocks.service';
import { db } from '@/server/db';
import { inArray } from 'drizzle-orm';
import { lessons } from '@/server/db/schema';
import VideoPlayer from '../shared/VideoPlayer';
import { supabaseService } from '@/server/services/supabase.service';

export default async function CourseVideosPreview() {
  const featuredLessonIds = await ContentBlocksService.getFeaeturedLessonIds();
  const featuredLessons = await db.query.lessons.findMany({
    where: inArray(lessons.id, featuredLessonIds),
    with: {
      video: true,
      thumbnail: true,
    },
  });

  return (
    <section className="bg-primary-foreground">
      <Container className="pt-32 flex flex-col lg:grid lg:grid-cols-2  justify-center">
        <div className="flex flex-col justify-center mx-auto mb-20 px-4 sm:pr-24">
          <HeaderTwo className="mb-4">Wyrusz w duchową podróż</HeaderTwo>
          <HeadingParagraph>
            Oddechownia narodziła się z tęsknoty za tym, co proste. Czekają tu
            na Ciebie łagodne treści na różne, wewnętrzne sezony: sekwencje
            wzmacniające ciało, wieczorne relaksacje, spotkania z oddechem oraz
            wykłady i opowieści z pogranicza filozofii, mitologii i anatomii.
            Wszystko po to, by krok po kroku wracać do domu. Do siebie.
          </HeadingParagraph>
        </div>
        <Carousel
          hideArrows
          settings={{
            infinite: false,
            rows: 2,
            slidesPerRow: 2,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            responsive: [
              {
                breakpoint: 640,
                settings: {
                  rows: 1,
                  slidesPerRow: 1,
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  infinite: false,
                },
              },
              {
                breakpoint: 1280,
                settings: {
                  rows: 2,
                  slidesPerRow: 2,
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  infinite: false,
                },
              },
            ],
          }}
        >
          {featuredLessons.map((lesson) => (
            <div key={lesson.id}>
              <VideoPlayer
                thumbnail={
                  supabaseService.getFileUrl(
                    lesson.thumbnail.name,
                    lesson.thumbnail.bucket,
                    lesson.thumbnail.path
                  ).data
                }
                playbackId={lesson.video!.publicPlaybackId!}
              />
            </div>
          ))}
        </Carousel>
        <Link
          href="/studio-jogi-online"
          className={cn(
            buttonVariants({ size: 'lg' }),
            'text-xl h-16 rounded-full col-start-2 place-self-end'
          )}
        >
          Przeglądaj filmy
        </Link>
      </Container>
    </section>
  );
}
