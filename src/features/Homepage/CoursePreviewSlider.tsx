import { HeaderTwo, HeadingParagraph } from '@/components/Headers/headers';
import Container from '@/components/Container/Container';
import Link from 'next/link';
import VideoPlayer from '../shared/VideoPlayer';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default async function CourseVideosPreview() {
  return (
    <section className="bg-primary-foreground">
      <Container>
        <div className="grid grid-cols-1 items-center lg:grid-cols-2">
          <div className="max-w-[600px] mx-auto text-center mb-20">
            <HeaderTwo className="mb-4">Wyrusz w duchową podróż</HeaderTwo>
            <HeadingParagraph className="mb-12">
              Różnorodna biblioteka filmów i praktyk
            </HeadingParagraph>
            <Link
              href="/studio-jogi-online"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'text-xl h-16 rounded-full'
              )}
            >
              Przeglądaj filmy <ArrowRight className="size-6" />
            </Link>
          </div>
          <VideoPlayer
            playbackId={'ky2un2dak00KBtDM8r4PXoU012RDN2aGMsqmcPu31Q35g'}
            videoSeries={'Wyrusz w duchową podróż'}
            videoTitle={'Wyrusz w duchową podróż'}
            thumbnail="/video_thumbnail.png"
          />
        </div>
      </Container>
    </section>
  );
}
