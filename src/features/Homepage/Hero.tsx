import { HeaderOne } from '@/components/Headers/headers';
import Image from 'next/image';
import Container from '@/components/Container/Container';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Hero() {
  return (
    <section className="hero-image-full-container relative overflow-hidden w-full ">
      <Container className="h-full">
        <div className="relative z-20 h-full w-full flex flex-col items-center sm:items-start justify-center sm:text-start px-4 sm:pr-24 sm:w-2/3 lg:w-1/2">
          <div className="text-white text-left">
            <span className="block mb-2">Oddechownia Studio Jogi</span>
            <div className="w-min whitespace-nowrap">
              <HeaderOne className="mb-8">
                <span className="">Twoje miejsce,</span> <br />
                by złapać oddech
              </HeaderOne>
              <Link
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'self-center md:self-start rounded-full text-xl text-richBlack h-14 mb-4'
                )}
                href={'/rejestracja'}
              >
                Dołącz teraz
              </Link>
            </div>
          </div>
        </div>
      </Container>
      <div className="absolute top-0 z-10 hero-image-full">
        <Image
          className="object-cover object-bottom"
          src="/hero_moze_dobre.jpg"
          alt="Hero image"
          fill
          priority
        />
        <div className="absolute top-0 w-full h-full bg-black sm:bg-transparent sm:bg-gradient-to-r from-black to-transparent opacity-50" />
      </div>
    </section>
  );
}
