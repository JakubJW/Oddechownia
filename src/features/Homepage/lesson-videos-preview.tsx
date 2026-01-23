import { HeaderTwo } from '@/components/Headers/headers';
import Container from '@/components/Container/Container';
import { ContentBlocksService } from '@/server/services/content-blocks.service';
import { db } from '@/server/db';
import { inArray } from 'drizzle-orm';
import { lessons } from '@/server/db/schema';
import VideoPlayer from '../shared/VideoPlayer';
import { supabaseService } from '@/server/services/supabase.service';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

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
      <Container className="flex flex-col md:flex-row gap-6 justify-center">
        <div className="flex flex-col justify-center flex-1">
          <hgroup className="text-center md:text-left">
            <HeaderTwo className="mb-8 font-light">
              Wyrusz w duchową podróż
            </HeaderTwo>
            <p className="mb-6 text-xl leading-relaxed font-light">
              Oddechownia to czuła przestrzeń, w której łączymy ruch z
              bezruchem, wiedzę z doświadczaniem, a duchowość z codziennością.
              Sprawdź i rozpocznij swoją pierwszą praktykę.{' '}
            </p>
          </hgroup>
          <Link
            className={cn(
              buttonVariants({ size: 'lg' }),
              'self-center md:self-start rounded-full text-xl h-12 mb-4'
            )}
            href={'/studio-jogi-online'}
          >
            Przeglądaj filmy
          </Link>
        </div>
        <div className="flex-1">
          <VideoPlayer
            thumbnail={
              supabaseService.getFileUrl(
                featuredLessons[0].thumbnail.name,
                featuredLessons[0].thumbnail.bucket,
                featuredLessons[0].thumbnail.path
              ).data
            }
            playbackId={'ky2un2dak00KBtDM8r4PXoU012RDN2aGMsqmcPu31Q35g'}
          />
        </div>
      </Container>
    </section>
  );
}
