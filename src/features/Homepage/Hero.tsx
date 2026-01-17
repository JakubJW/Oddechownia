import { HeaderOne } from '@/components/Headers/headers';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Container from '@/components/Container/Container';

export default function Hero() {
  return (
    <section className="hero-image-full-container relative overflow-hidden w-full ">
      <Container className="h-full">
        <div className="relative z-20 h-full w-full flex flex-col items-center sm:items-start justify-center sm:text-start px-4 sm:pr-24 gap-6 md:gap-y-16 sm:w-2/3 lg:w-1/2">
          <hgroup className="mt-10 sm:mt-0 text-white text-left">
            <span className="block mb-2">Oddechownia Studio Jogi</span>
            <div className="mb-10 w-min whitespace-nowrap">
              <HeaderOne>
                <span className="">Twoje miejsce,</span> <br />
                by złapać oddech
              </HeaderOne>
              <span className="block text-right text-base mt-2">
                gdziekolwiek jesteś
              </span>
            </div>
            <p className="leading-relaxed text-justify text-xl">
              Pragniesz, aby joga rozgościła się w Twojej codzienności? W
              Oddechowni poznasz tę wspaniałą praktykę w pełni - od pracy z
              ciałem, przez oddech i medytację, po filozofię i duchowe korzenie.
              Czule, we własnym rytmie, online.
            </p>
          </hgroup>
          <Link
            className={cn(
              buttonVariants({ size: 'lg' }),
              'flex rounded-full font-semibold text-white bg-secondary-foreground text-xl h-16 w-min'
            )}
            href={'/rejestracja'}
          >
            Dołącz do studia
          </Link>
        </div>
      </Container>
      <div className="absolute top-0 z-10 hero-image-full">
        <Image
          className="object-cover object-center"
          src="/hero.jpeg"
          alt="Hero image"
          fill
          priority
        />
        <div className="absolute top-0 w-full h-full bg-black sm:bg-transparent sm:bg-gradient-to-r from-black to-transparent opacity-50" />
      </div>
    </section>
  );
}
