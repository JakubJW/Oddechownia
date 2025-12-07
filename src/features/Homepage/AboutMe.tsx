import { HeaderTwo } from '@/components/Headers/headers';
import Image from 'next/image';

export default function AboutMe() {
  return (
    <section>
      <div className="flex">
        <div className="relative w-1/3 hidden md:block">
          <div className="absolute z-10 h-full w-full bg-gradient-to-r from-transparent via-transparent to-white" />
          <Image
            className="homepage-hero-image object-cover object-bottom -scale-x-100"
            src="/homepage_2.jpg"
            alt="Hero image"
            height={3088}
            width={2048}
            priority={true}
          />
        </div>
        <div className="pt-32 px-4 flex flex-col gap-6 md:gap-y-8 mx-auto md:max-w-[600px]">
          <hgroup className="mb-6">
            <HeaderTwo>O mnie</HeaderTwo>
          </hgroup>
          <div>
            <p className="z-10 order-2 md:order-1">
              Cześć!
              <br />
              <br />
              Mam na imię Weronika i witam Cię w mojej czułej, jogowej
              przestrzeni. ♡
              <br />
              <br />
              Joga towarzyszy mi od blisko 6 lat - początkowo jako wsparcie w
              rehabilitacji, by szybko wkraść się do mojego życia na wielu
              płaszczyznach i… absolutnie je odmienić!
              <br />
              <br />
              Uczę jogi zarówno na macie, jak i poza nią, a moją małą, prywatną
              misją jest pokazanie, że joga jest naprawdę dla każdego. W
              Oddechowni znajdziesz różnorodne, wspierające praktyki, ale też
              treści związane z filozofią jogi, tematyką mindfulness czy miłe,
              jogowe pogadanki! To miejsce na spotkanie ze sobą, świadomą
              obecność w ciele i poszukiwanie odpowiedzi na pytania wewnątrz.
              <br />
              <br />
              Nie jestem i nie planuję być związana z żadną konkretną ścieżką. W
              swoim nauczaniu podchodzę do tematu holistycznie, korzystając z
              całego dobra, jakie oferuje nam tradycyjna joga. Jestem
              certyfikowaną przez Yoga Alliance nauczycielką jogi (RYT200, Joga
              Nidra YACEP Art of Chanting YACEP) i wciąż pozostaję również
              wierną i oddaną uczennicą na tej magicznej ścieżce.
              <br />
              <br />
              Do zobaczenia na macie!
              <br />
              <br />
              Weronika
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
