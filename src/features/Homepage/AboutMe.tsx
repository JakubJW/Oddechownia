import Container from '@/components/Container/Container';
import HeaderTwo from '@/components/Headers/HeaderTwo';
import BackgroundLines from '../../../public/background-lines.svg';
import Dot from '../../../public/dot.svg';
import Image from 'next/image';

export default function AboutMe() {
  return (
    <section className="relative">
      <Image
        className="absolute top-1/2 -translate-y-1/2 rotate-180 w-full right-0"
        src={BackgroundLines}
        alt="Background lines"
      />
      <Container>
        <hgroup className="text-center mb-24">
          <HeaderTwo>O mnie</HeaderTwo>
        </hgroup>
        <div className="grid grid-cols-1 md:grid-cols-2 justify-items-center gap-6">
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
            jogowe pogadanki! To miejsce na spotkanie ze sobą, świadomą obecność
            w ciele i poszukiwanie odpowiedzi na pytania wewnątrz.
            <br />
            <br />
            Nie jestem i nie planuję być związana z żadną konkretną ścieżką. W
            swoim nauczaniu podchodzę do tematu holistycznie, korzystając z
            całego dobra, jakie joga nam oferuje. Jestem certyfikowaną przez
            Yoga Alliance nauczycielką jogi (RYT200, Joga Nidra YACEP,
            Restorative Yoga YACEP, Art of Chanting YACEP).
            <br />
            <br />
            Do zobaczenia na macie!
            <br />
            <br />
            Weronika
          </p>
          <div className="relative border-8 border-primaryBg rounded-full inline-block h-min">
            <Image
              src={Dot}
              alt="Dot"
              className="h-12 w-12 absolute -right-4 -top-4"
            />
            <Image
              src={Dot}
              alt="Dot"
              className="h-8 w-8 absolute right-12 -top-10"
            />
            {/* <Image
              src="https://wknpvvtasrhwkqmkvoml.supabase.co/storage/v1/object/public/Public/images/pexels-pixabay-460307.jpg"
              height={400}
              width={400}
              className="object-cover rounded-full border-4 border-primaryFg h-full aspect-square"
              alt="Me"
            /> */}
            <Image
              src={Dot}
              alt="Dot"
              className="h-12 w-12 absolute -left-4 -bottom-4"
            />
            <Image
              src={Dot}
              alt="Dot"
              className="h-8 w-8 absolute left-12 -bottom-10"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
