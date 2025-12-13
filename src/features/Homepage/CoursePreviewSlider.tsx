import { HeaderTwo, HeadingParagraph } from '@/components/Headers/headers';
import Container from '@/components/Container/Container';
import Link from 'next/link';
import VideoPlayer from '../shared/VideoPlayer';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import Carousel from '@/components/Carousel/Carousel';

export default async function CourseVideosPreview() {
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
          <VideoPlayer
            playbackId={'ky2un2dak00KBtDM8r4PXoU012RDN2aGMsqmcPu31Q35g'}
            videoSeries={'Wyrusz w duchową podróż'}
            videoTitle={'Wyrusz w duchową podróż'}
            thumbnail="/video_thumbnail.png"
          />
          <VideoPlayer
            playbackId={'ky2un2dak00KBtDM8r4PXoU012RDN2aGMsqmcPu31Q35g'}
            videoSeries={'Wyrusz w duchową podróż'}
            videoTitle={'Wyrusz w duchową podróż'}
            thumbnail="/video_thumbnail.png"
          />
          <VideoPlayer
            playbackId={'ky2un2dak00KBtDM8r4PXoU012RDN2aGMsqmcPu31Q35g'}
            videoSeries={'Wyrusz w duchową podróż'}
            videoTitle={'Wyrusz w duchową podróż'}
            thumbnail="/video_thumbnail.png"
          />
          <VideoPlayer
            playbackId={'ky2un2dak00KBtDM8r4PXoU012RDN2aGMsqmcPu31Q35g'}
            videoSeries={'Wyrusz w duchową podróż'}
            videoTitle={'Wyrusz w duchową podróż'}
            thumbnail="/video_thumbnail.png"
          />
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
