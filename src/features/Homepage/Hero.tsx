import HeaderOne from '@/components/Headers/HeaderOne';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Container from '@/components/Container/Container';

export default function Hero() {
  return (
    <section className="homepage-hero relative">
      <Container className="h-full">
        <div className="h-full w-full flex flex-col justify-center pl-4 pr-24 gap-6 md:gap-y-16 lg:w-1/2">
          <hgroup className="mt-20 md:mt-0 text-center md:text-left">
            <span className="block text-muted-foreground text-base font-light text mb-2">
              Oddechownia Studio Jogi
            </span>
            <HeaderOne className="mb-10 w-min whitespace-nowrap">
              <span className="text-matcha">Twoje miejsce,</span> <br />
              by złapać oddech
              <span className="block text-right text-muted-foreground font-light text-base mt-2">
                gdziekolwiek jesteś
              </span>
            </HeaderOne>
            <p className="leading-relaxed text-justify text-xl font-light">
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
        <div className="hidden lg:block absolute top-0 right-0 w-1/2 h-full">
          <Image
            className="object-cover object-bottom w-full h-full hidden md:block"
            src="/hero2.jpg"
            alt="Hero image"
            fill
            priority={true}
          />
        </div>
      </Container>
    </section>
  );
}
