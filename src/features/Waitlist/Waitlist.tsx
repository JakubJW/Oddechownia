import WaitlistForm from './WaitlistForm';
import Image from 'next/image';

export default function Waitlist() {
  return (
    <section className="h-screen">
      <div className="flex flex-col h-full justify-between md:flex-row md:items-center">
        <div className="p-12 rounded-lg space-y-6 sm:space-y-8 md:mx-auto md:max-w-2xl">
          <h1 className="font-bold text-3xl">
            Oddechownia - Twoje miejsce, by złapać oddech.{' '}
          </h1>
          <p className="mt-4">
            Oddechownia to nie tylko studio jogi online. To miejsce dla każdego:
            dla zmęczonych, dla poszukujących, dla tych, którzy chcą wrócić do
            siebie.{' '}
            <strong>
              Już wkrótce otworzę dla Was tę wspaniałą przestrzeń do wspólnej
              praktyki online - i nie tylko.
            </strong>
          </p>
          <p className="mt-4">
            Jeśli chcesz być jedną z pierwszych osób, które się o tym dowiedzą,
            zostaw swoje imię i adres e-mail. Tuż przed premierą wyślę Ci
            przypomnienie - <strong>i mały prezent na dobry początek.</strong>{' '}
            🤍
          </p>
          <p className="mt-4">Dziękuję, że jesteś.</p>
          <WaitlistForm />
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
