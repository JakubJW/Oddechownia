import HeaderOne from '@/components/Headers/HeaderOne';
import Image from 'next/image';

export default function Hero() {
  return (
    <div className="relative">
      <Image
        src="/Image.png"
        width={1920}
        height={316}
        alt="Hero image"
        className="absolute top-0 -z-10 w-full h-full object-cover bg-black"
      />
      <hgroup className="text-center py-12">
        <HeaderOne className="text-white">
          Odkryj <span className="text-primaryFg">korzyści jogi</span> <br />
          dla ciała i umysłu.
        </HeaderOne>
        <p className='text-white'>Poradniki, pozycje i inspiracje dla każdego.</p>
      </hgroup>
    </div>
  );
}
