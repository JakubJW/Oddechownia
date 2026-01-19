import { HeaderTwo, HeadingParagraph } from '@/components/Headers/headers';
import Container from '@/components/Container/Container';
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
      <Container className="pt-32 flex flex-col lg:grid lg:grid-cols-2 gap-6 justify-center">
        <div className="sm:pr-24">
          <HeaderTwo className="mb-8">Wyrusz w duchową podróż</HeaderTwo>
          <HeadingParagraph className="mb-6 font-normal">
            Oddechownia to czuła przestrzeń, w której łączymy ruch z bezruchem,
            wiedzę z doświadczaniem, a duchowość z codziennością.
          </HeadingParagraph>
          <p className="mb-6 text-lg leading-relaxed font-light">
            To pierwsze w Polsce studio online, w którym tak głęboko zanurzamy
            się w jogę również poza matą: poznasz tu anatomię subtelną,
            filozofię jogi, mitologię indyjską, ajurwedę i cykliczność natury.
          </p>
          <p className="text-lg leading-relaxed font-light">
            Posłuchaj inspirujących wykładów i opowieści, które nadadzą Twojej
            praktyce asan głębszy sens. Zarejestruj się i testuj wszystko przez
            3 dni za darmo.
          </p>
        </div>
        <VideoPlayer
          thumbnail={
            supabaseService.getFileUrl(
              featuredLessons[0].thumbnail.name,
              featuredLessons[0].thumbnail.bucket,
              featuredLessons[0].thumbnail.path
            ).data
          }
          playbackId={featuredLessons[0].video!.publicPlaybackId!}
        />
      </Container>
    </section>
  );
}
