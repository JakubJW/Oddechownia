import Image from 'next/image';

export default function AboutMe() {
  return (
    <section className="bg-gradient-to-b from-primary-foreground to-white lg:from-white">
      <div className="flex flex-col-reverse lg:flex-row">
        <div className="relative w-full aspect-[3/4] lg:aspect-auto lg:h-auto lg:w-1/3 block">
          <div className="absolute z-10 h-full w-full " />
          <Image
            className="object-cover object-bottom -scale-x-100"
            src="/homepage_2.jpg"
            alt="Hero image"
            fill
            priority={true}
          />
        </div>
        <div className="py-12 sm:py-24 px-4 mx-auto md:max-w-[600px]">
          <div>
            <p className="text-lg z-10 order-2 md:order-1">
              Hari Om.
              <br />
              <br />
              Mam na imię Weronika i witam Cię w mojej czułej, jogowej
              przestrzeni.
              <br />
              <br />
              Joga towarzyszy mi od ponad 6 lat - początkowo jako wsparcie w
              rehabilitacji, by szybko wkraść się do mojego codziennego życia i…
              absolutnie je odmienić.
              <br />
              <br />
              Uczę jogi na macie i poza nią, bo wierzę, że jej mądrość sięga
              daleko poza fizyczną praktykę i daje realne wsparcie w wyzwaniach,
              jakie stawia przed nami współczesny świat - jest wiedzą prostą,
              żywą i dostępną dla każdego. Z tej potrzeby i z tęsknoty za tym,
              co proste, narodziła się Oddechownia: miejsce, w którym obok
              wspierających praktyk dla ciała, znajdziesz również odżywcze
              treści z pogranicza filozofii jogi, mitologii indyjska, ajurwedy
              czy cykliczności.
              <br />
              <br />
              Nie jestem i nie planuję być związana z żadną konkretną ścieżką. W
              swoim nauczaniu podchodzę do tematu holistycznie, z uważnością na
              tradycję i z czułością dla współczesnego życia. Jestem
              certyfikowaną przez Yoga Alliance nauczycielką jogi (RYT200, Joga
              Nidra YACEP, Art of Chanting YACEP) i z radością pogłębiam
              nieustannie swoją praktykę oraz nauczanie.
              <br />
              <br />
              Namaste, Weronika
              <br />
              Weronika
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
