import HeaderOne from '@/components/Headers/HeaderOne';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Container from '@/components/Container/Container';
import { Leaf } from 'lucide-react';
import Image from 'next/image';

export default function Hero() {
  return (
    <section>
      <div className="flex items-center">
        <div className="px-4 flex flex-col gap-6 md:gap-y-8 mx-auto md:max-w-[600px]">
          <hgroup className="mt-20 md:mt-0 space-y-6 text-center md:text-left">
            <HeaderOne>
              <span className="text-matcha">Twoje miejsce,</span> <br />
              by złapać oddech
            </HeaderOne>
            <p className="leading-relaxed">
              Ćwicz jogę online z doświadczonymi instruktorami, bez wychodzenia
              z domu. Popraw elastyczność, zredukuj stres i zbuduj siłę we
              własnym tempie - niezależnie od poziomu zaawansowania.
            </p>
          </hgroup>
          {/* <div className="inline-flex items-center gap-4 p-2 rounded-full bg-matcha-foreground mr-2">
            <div className="inline-block rounded-full bg-matcha p-2 sm:p-4">
              <MessagesSquare className="text-rich-black-foregound h-4 w-4 sm:h-6 sm:w-6" />
            </div>
            <span className="text-rich-black-foreground text-sm sm:text-base pr-4">
              50+ filmów instruktażowych
            </span>
          </div>
          <div className="inline-flex items-center gap-4 p-2 rounded-full bg-matcha-foreground">
            <div className="inline-block rounded-full bg-matcha p-2 sm:p-4">
              <MessagesSquare className="text-rich-black-foregound h-4 w-4 sm:h-6 sm:w-6" />
            </div>
            <span className="text-steel-black-foreground text-sm sm:text-base pr-4">
              1000+ zadowolonych klientów
            </span>
          </div> */}
          <Link
            className={cn(
              buttonVariants({ size: 'lg' }),
              'flex rounded-full font-semibold text-white bg-secondary-foreground text-xl h-16 w-min'
            )}
            href={'/dolacz-do-nas'}
          >
            Dołącz do mnie!
          </Link>
        </div>
        <Image
          className="homepage-hero-image object-cover object-bottom  w-1/2 hidden md:block"
          src="/hero2.jpg"
          alt="Hero image"
          height={3088}
          width={2048}
          priority={true}
        />
      </div>
    </section>
  );
}
