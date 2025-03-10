import HeaderOne from '@/components/Headers/HeaderOne';

export default function Hero() {
  return (
    <div className='py-12 bg-gray-400'>
      <hgroup className='text-center'>
        <HeaderOne className="text-white">
          Odkryj <span className="text-primaryFg">korzyści jogi</span> <br />
          dla ciała i umysłu.
        </HeaderOne>
        <p>Poradniki, pozycje i inspiracje dla każdego.</p>
      </hgroup>
    </div>
  );
}
