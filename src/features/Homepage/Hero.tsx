import Image from 'next/image';
import { MessagesSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HeaderOne from '@/components/Headers/HeaderOne';

export default function Hero() {
  return (
    <section>
      <div className="flex items-center">
        <div className="px-4 space-y-6 sm:space-y-8 mx-auto md:max-w-[600px]">
          <hgroup className="mt-20 md:mt-0 space-y-6 text-center md:text-left">
            <HeaderOne>
              Odnajdź <span className="text-primaryFg">spokój.</span>
              <br />
              <span className="text-primaryFg">Wzmocnij</span> ciało.
            </HeaderOne>
            <p className="text-lightgrey leading-relaxed">
              Ćwicz jogę online z doświadczonymi instruktorami, bez wychodzenia
              z domu. Popraw elastyczność, zredukuj stres i zbuduj siłę we
              własnym tempie - niezależnie od poziomu zaawansowania.
            </p>
          </hgroup>
          <div className="inline-flex items-center gap-4 p-2 rounded-full bg-primaryBg mr-2">
            <div className="inline-block rounded-full bg-primaryFg p-2 sm:p-4">
              <MessagesSquare className="text-white h-4 w-4 sm:h-6 sm:w-6" />
            </div>
            <span className="text-primaryFg text-sm sm:text-base pr-4">50+ filmów instruktażowych</span>
          </div>
          <div className="inline-flex items-center gap-4 p-2 rounded-full bg-primaryBg">
            <div className="inline-block rounded-full bg-primaryFg p-2 sm:p-4">
              <MessagesSquare className="text-white h-4 w-4 sm:h-6 sm:w-6" />
            </div>
            <span className="text-primaryFg text-sm sm:text-base pr-4">1000+ zadowolonych klientów</span>
          </div>
          <Button
            size="lg"
            className="block rounded-full font-bold text-xl h-16"
          >
            Dołącz teraz!
          </Button>
        </div>
        <Image
          className="homepage-hero-image object-cover w-1/2 hidden md:block"
          src="https://wknpvvtasrhwkqmkvoml.supabase.co/storage/v1/object/public/Public/images/pexels-pixabay-460307.jpg"
          alt="Hero image"
          height={1365}
          width={2048}
          priority={true}
        />
      </div>
    </section>
  );
}
