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
      <Container className="pt-32">
        <div className="flex gap-6">
          <div className="flex-1"></div>
          <div className="flex-1">
            <HeaderTwo className="mb-8">
              Odkryj przestrzeń dla swojego spokoju
            </HeaderTwo>
            <p className="mb-6 text-lg font-light">
              Oddechownia to przestrzeń do regularnej, uważnej praktyki – wtedy,
              kiedy masz na nią miejsce i gotowość. Bez pośpiechu. Bez presji.
              Bez „muszę”.
            </p>
            <p className="mb-6 text-lg font-light">
              Zyskujesz dostęp do bogatej biblioteki jogi, medytacji i pracy z
              oddechem. Czekają tu na Ciebie gotowe playlisty, które poprowadzą
              Cię krok po kroku: od porannych rozruchów, przez łagodne sesje yin
              i jogę nidrę, aż po praktyki dopasowane do Twojego cyklu, emocji
              czy pory dnia. To coś więcej niż tylko ćwiczenia.
            </p>
            <p className="mb-12 text-lg font-light">
              To proces, który wplatasz w swoją codzienność – w swoim tempie i
              własnym rytmie. W domu.
            </p>

            <HeadingParagraph className="text-2xl font-normal mb-8">
              Dołączając do Oddechowni, otrzymujesz:
            </HeadingParagraph>

            <div className="space-y-4 mb-8">
              <Feature icon={<Play className="size-6 text-matcha" />}>
                Dostęp do dziesiątek praktyk jogi, medytacji i nidry
              </Feature>
              <Feature icon={<Puzzle className="size-6 text-matcha" />}>
                Tematyczne playlisty prowadzące Cię za rękę
              </Feature>
              <Feature icon={<Moon className="size-6 text-matcha" />}>
                Sesje na sen, regenerację, energię i czas menstruacji
              </Feature>
              <Feature icon={<Video className="size-6 text-matcha" />}>
                Dwa darmowe spotkania na żywo w miesiącu (dla subskrybentów)
              </Feature>
              <Feature icon={<Home className="size-6 text-matcha" />}>
                Pełną swobodę – matę rozwijasz, gdzie i kiedy chcesz
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
