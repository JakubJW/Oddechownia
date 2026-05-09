import Container from '@/components/Container/Container';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="hero-image-half-container relative overflow-hidden w-full ">
      <Container className="h-full">
        <div className="relative z-20 h-full w-full flex flex-col items-center sm:items-start justify-center sm:text-start px-4 sm:pr-24 gap-6 md:gap-y-16 sm:w-2/3 lg:w-1/2">
          <hgroup className="text-center max-w-3xl mx-auto space-y-6 mb-24">
            <h1 className="text-2xl leading-normal xl:text-4xl xl:leading-relaxed">
              Zajęcia na żywo online
            </h1>
            <p className="font-montserrat text-lg">
              Dołącz do mnie na spotkaniach na żywo (Zoom), podczas których
              praktykujemy razem w czasie rzeczywistym. To przestrzeń wspólnej
              obecności, uważności i łagodnej pracy z ciałem, oddechem i umysłem
              - bez wychodzenia z domu.
            </p>
          </hgroup>
        </div>
      </Container>
      <div className="absolute top-0 z-10 hero-image-full">
        <Image
          className="object-cover object-center"
          src="/hero2.jpg"
          alt="Hero image"
          fill
          priority
        />
        <div className="absolute top-0 w-full h-full bg-black sm:bg-transparent sm:bg-linear-to-r from-black to-transparent opacity-50" />
      </div>
    </section>
  );
}
