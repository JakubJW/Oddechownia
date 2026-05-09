import Container from '@/components/Container/Container';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Play, Home, Video, MessageCircle, Book } from 'lucide-react';
import { Feature } from '../shared/feature';
import Om from '@/assets/Om.svg';
import Sloneczko from '@/assets/Sloneczko.svg';
import Kwiatek from '@/assets/Kwiatek.svg';
import {
  FeatureCircle,
  FeatureCircleTitle,
  FeatureCircleDescription,
  FeatureCircleImage,
} from '../shared/feature-circle';
import Image from 'next/image';

const Features = () => {
  return (
    <section>
      <Container>
        <h2 className="text-2xl leading-normal xl:text-4xl xl:leading-relaxed text-center font-light mb-12">
          Więcej, niż joga na YouTube
        </h2>
        <div className="space-y-32">
          <div className="flex flex-col md:flex-row gap-16">
            <FeatureCircle>
              <FeatureCircleImage>
                <Om className="size-40" />
              </FeatureCircleImage>
              <FeatureCircleTitle>
                Dla ciała i układu nerwowego
              </FeatureCircleTitle>
              <FeatureCircleDescription>
                100+ praktyk asan, jogi nidry, medytacji prowadzonych i technik
                oddechowych
              </FeatureCircleDescription>
            </FeatureCircle>

            <FeatureCircle>
              <FeatureCircleImage>
                <Sloneczko className="size-40" />
              </FeatureCircleImage>
              <FeatureCircleTitle>Praktyka poza matą</FeatureCircleTitle>
              <FeatureCircleDescription>
                Wykłady o filozofii jogi, kobiecej cykliczności, anatomii
                subtelnej, mitologii i nie tylko
              </FeatureCircleDescription>
            </FeatureCircle>

            <FeatureCircle>
              <FeatureCircleImage>
                <Kwiatek className="size-40" />
              </FeatureCircleImage>
              <FeatureCircleTitle>Indywidualne wsparcie</FeatureCircleTitle>
              <FeatureCircleDescription>
                Stały kontakt z nauczycielem, gotowe plany praktyki i materiały
                edukacyjne (e-booki)
              </FeatureCircleDescription>
            </FeatureCircle>
          </div>

          <div className="flex flex-col md:flex-row gap-16">
            <div className="relative w-full aspect-3/4 md:aspect-auto md:w-1/2 xl:w-2/3 ">
              <Image
                className="object-cover rounded-[32px]"
                src="/hero2.jpg"
                fill
                alt="Obrazek"
              />
            </div>

            <div className="flex flex-col md:w-1/2 xl:w-1/3">
              <h3 className="text-2xl font-normal mb-8">
                Dołączając do Oddechowni, otrzymujesz:
              </h3>
              <ul className="space-y-4 mb-8">
                <Feature icon={<Play className="size-6 text-matcha" />}>
                  Dostęp do Studia Jogi Online i biblioteki 100+ materiałów
                  wideo
                </Feature>
                <Feature icon={<Video className="size-6 text-matcha" />}>
                  Programy praktyk dostosowane do Twoich potrzeb
                </Feature>
                <Feature icon={<Book className="size-6 text-matcha" />}>
                  Darmowe materiały edukacyjne do pobrania
                </Feature>
                <Feature
                  icon={<MessageCircle className="size-6 text-matcha" />}
                >
                  Indywidualne wsparcie w praktyce i stały kontakt z
                  nauczycielką
                </Feature>
                <Feature icon={<Home className="size-6 text-matcha" />}>
                  Możliwość praktykowania gdzie chcesz, kiedy chcesz - we
                  własnym rytmie
                </Feature>
              </ul>

              <Link
                className={cn(
                  buttonVariants(),
                  'flex rounded-full self-center md:self-start text-white text-lg h-12'
                )}
                href={'/rejestracja'}
              >
                Rozpocznij praktykę
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Features;
