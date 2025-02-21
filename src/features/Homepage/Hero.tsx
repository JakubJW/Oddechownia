import Image from 'next/image';
import { MessagesSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section>
      <div className="flex items-center">
        <div className="px-4 space-y-8 mx-auto max-w-[600px]">
          <hgroup className="text-center md:text-left">
            <h1 className="font-bold text-4xl leading-normal xl:text-5xl xl:leading-relaxed">
              Odnajdź <span className="text-primaryFg">spokój.</span>
              <br />
              <span className="text-primaryFg">Wzmocnij</span> ciało.
            </h1>
            <p className="text-lightgrey leading-relaxed">
              Ćwicz jogę online z doświadczonymi instruktorami, bez wychodzenia
              z domu. Popraw elastyczność, zredukuj stres i zbuduj siłę we
              własnym tempie - niezależnie od poziomu zaawansowania.
            </p>
          </hgroup>
          <div className="inline-flex items-center gap-4 p-2 rounded-full bg-primaryBg mr-2">
            <div className="inline-block rounded-full bg-primaryFg p-4">
              <MessagesSquare className="text-white" />
            </div>
            <span className="text-primaryFg pr-4">Blog ze wskazówkami</span>
          </div>
          <div className="inline-flex items-center gap-4 p-2 rounded-full bg-primaryBg">
            <div className="inline-block rounded-full bg-primaryFg p-4">
              <MessagesSquare className="text-white" />
            </div>
            <span className="text-primaryFg pr-4">Blog ze wskazówkami</span>
          </div>
          <Button
            size="lg"
            className="block rounded-full font-bold text-xl h-16"
          >
            Dołącz teraz!
          </Button>
        </div>
        <Image
          className="h-screen object-cover w-1/2 hidden md:block"
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
