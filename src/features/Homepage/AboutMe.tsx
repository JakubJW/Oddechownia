import Image from 'next/image';
import Container from '@/components/Container/Container';

export default function AboutMe() {
  return (
    <section>
      <Container>
        <div className="flex flex-col-reverse md:flex-row gap-8 md:gap-16">
          <div className="relative w-full aspect-[3/4] md:aspect-auto md:w-1/2">
            <Image
              className="object-cover object-center rounded-[32px]"
              src="/homepage_2.jpg"
              alt="Hero image"
              fill
            />
          </div>
          <div className="md:w-1/2 l-12">
            <p className="font-light text-lg mb-6">Hari Om.</p>
            <p className="font-light text-lg mb-6">
              Mam na imię Weronika i witam Cię w mojej czułej, jogowej
              przestrzeni.
            </p>
            <p className="font-light text-lg mb-6">
              Joga towarzyszy mi od ponad 6 lat - początkowo jako wsparcie w
              rehabilitacji, by szybko wkraść się do mojego codziennego życia i…
              absolutnie je odmienić.
            </p>
            <p className="font-light text-lg mb-6">
              Uczę jogi na macie i poza nią, bo wierzę, że jej mądrość sięga
              daleko poza fizyczną praktykę i daje realne wsparcie w wyzwaniach,
              jakie stawia przed nami współczesny świat - jest wiedzą prostą,
              żywą i dostępną dla każdego. Z tej potrzeby i z tęsknoty za tym,
              co proste, narodziła się Oddechownia: miejsce, w którym obok
              wspierających praktyk dla ciała, znajdziesz również odżywcze
              treści z pogranicza filozofii jogi, mitologii indyjskiej, ajurwedy
              czy cykliczności.
            </p>
            <p className="font-light text-lg mb-6">
              Nie jestem i nie planuję być związana z żadną konkretną ścieżką. W
              swoim nauczaniu podchodzę do tematu holistycznie, z uważnością na
              tradycję i z czułością dla współczesnego życia. Jestem
              certyfikowaną przez Yoga Alliance nauczycielką jogi (RYT200, Joga
              Nidra YACEP, Art of Chanting YACEP) i z radością pogłębiam
              nieustannie swoją praktykę oraz nauczanie.
            </p>
            <p className="font-light text-lg">Namaste</p>
            <p className="font-light text-lg">Weronika</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
