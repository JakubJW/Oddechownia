import { HeaderOne } from '@/components/Headers/headers';
import Image from 'next/image';

export default function MaintenanceMode() {
  return (
    <section className="h-full">
      <div className="flex flex-col h-full justify-between md:flex-row md:items-center">
        <div className="flex h-1/2 items-center px-4 space-y-6 sm:space-y-8 md:mx-auto text-center md:max-w-[600px]">
          <HeaderOne className="grow">
            Strona <span className="text-primaryFg">w budowie.</span>
          </HeaderOne>
        </div>
        <Image
          className="h-1/2 md:h-full object-cover object-bottom md:w-1/2"
          src="/auth-hero.png"
          alt="Hero image"
          height={3088}
          width={2048}
          priority={true}
        />
      </div>
    </section>
  );
}
