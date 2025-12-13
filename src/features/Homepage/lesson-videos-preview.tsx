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
      <Container className="flex flex-col">
        <div className="max-w-[700px] mx-auto mb-20">
          <HeaderTwo className="mb-4 text-center">
            Wyrusz w duchową podróż
          </HeaderTwo>
          <HeadingParagraph className="mb-12">
            Oddechownia narodziła się z tęsknoty za tym, co proste. Czekają tu
            na Ciebie łagodne treści na różne, wewnętrzne sezony: sekwencje
            wzmacniające ciało, wieczorne relaksacje, spotkania z oddechem oraz
            wykłady i opowieści z pogranicza filozofii, mitologii i anatomii.
            Wszystko po to, by krok po kroku wracać do domu. Do siebie.
          </HeadingParagraph>
        </div>
        <Carousel>
          {featuredLessons.map((lesson) => (
            <VideoPlayer
              key={lesson.id}
              thumbnail={
                supabaseService.getFileUrl(
                  lesson.thumbnail.name,
                  lesson.thumbnail.bucket,
                  lesson.thumbnail.path
                ).data
              }
              playbackId={lesson.video!.publicPlaybackId!}
            />
          ))}
        </Carousel>
        <Link
          href="/studio-jogi-online"
          className={cn(
            buttonVariants({ size: 'lg' }),
            'text-xl h-16 rounded-full self-end'
          )}
        >
          Przeglądaj filmy
        </Link>
      </Container>
    </section>
  );
}
