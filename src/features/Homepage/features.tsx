import Container from '@/components/Container/Container';
import { HeaderTwo, HeadingParagraph } from '@/components/Headers/headers';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Moon, Puzzle, Play, Home, Video } from 'lucide-react';
import { Feature } from '../shared/feature';

const Features = () => {
  return (
    <section>
      <Container>
        <div className="flex gap-6">
          <div className="flex-1"></div>
          <div className="flex-1">
            <HeaderTwo className="mb-8">
              Co czeka na Ciebie w Oddechowni?
            </HeaderTwo>
            <p className="mb-6 text-lg leading-relaxed font-light">
              Oddechownia to przestrzeń do regularnej, uważnej praktyki – wtedy,
              kiedy masz na nią miejsce i gotowość. Bez pośpiechu. Bez presji.
              Bez „muszę”.
            </p>
            <p className="mb-6 text-lg leading-relaxed font-light">
              W ramach subskrypcji zyskujesz dostęp do bogatej biblioteki
              praktyk jogi, medytacji i pracy z oddechem – ułożonych w
              playlisty, które prowadzą Cię krok po kroku. Od porannych
              rozruchów, przez łagodne sesje yin i jogę nidrę, po praktyki na
              konkretne momenty cyklu, emocji czy pory dnia. To coś więcej niż
              ćwiczenia.
            </p>
            <p className="mb-12 text-lg leading-relaxed font-light">
              To proces, który możesz wplatać w swoją codzienność – w swoim
              tempie, w swoim rytmie, w swoim domu.
            </p>

            <HeadingParagraph className="text-2xl font-normal mb-8">
              Dołączając do Oddechowni, otrzymujesz:
            </HeadingParagraph>

            <div className="space-y-4 mb-8">
              <Feature icon={<Play className="size-6 text-matcha" />}>
                dostęp do dziesiątek praktyk jogi, medytacji i jogi nidry
              </Feature>
              <Feature icon={<Puzzle className="size-6 text-matcha" />}>
                playlisty tematyczne prowadzone krok po kroku
              </Feature>
              <Feature icon={<Moon className="size-6 text-matcha" />}>
                praktyki na różne potrzeby: sen, regenerację, energię i czas
                menstruacji
              </Feature>
              <Feature icon={<Video className="size-6 text-matcha" />}>
                dwie darmowe sesje live w miesiącu (dla subskrybentów)
              </Feature>
              <Feature icon={<Home className="size-6 text-matcha" />}>
                pełną swobodę – praktykujesz gdzie i kiedy chcesz
              </Feature>
            </div>

            <p className="text-md font-light mb-6">
              Zacznij od 3-dniowego dostępu próbnego i sprawdź, czy to
              przestrzeń dla Ciebie.
            </p>
            <Link
              className={cn(
                buttonVariants(),
                'flex rounded-full w-min text-white text-lg h-12 mb-4'
              )}
              href={'/rejestracja'}
            >
              Wypróbuj Oddechownię
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Features;
