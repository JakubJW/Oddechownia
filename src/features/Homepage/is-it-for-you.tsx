import Container from '@/components/Container/Container';
import Brandmark from '@/assets/Brandmark.svg';
import Image from 'next/image';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Bold = ({ children }: { children: React.ReactNode }) => {
  return <p className="text-lg">{children}</p>;
};

const Italic = ({ children }: { children: React.ReactNode }) => {
  return <p className="italic font-light">{children}</p>;
};

const Statement = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

const IsItForYou = () => {
  return (
    <section>
      <Container className="flex flex-col md:flex-row md:items-center gap-16">
        <div className="relative overflow-hidden md:overflow-visible md:w-1/2 xl:w-2/3">
          <h2 className="text-2xl leading-normal xl:text-4xl xl:leading-relaxed mb-8 font-light">
            Oddechownia jest dla ciebie, jeśli...
          </h2>
          <div className="space-y-6">
            <Statement>
              <Bold>Chcesz praktykować w swoim rytmie</Bold>
              <Italic>
                bez pośpiechu, bez porównań, bez „muszę zdążyć na zajęcia”
              </Italic>
            </Statement>
            <Statement>
              <Bold>
                Szukasz miejsca, które wspiera regularność, a nie presję
              </Bold>
              <Italic>
                gdzie praktyka dopasowuje się do Twojego dnia, energii i
                nastroju
              </Italic>
            </Statement>
            <Statement>
              <Bold>Czujesz, że joga to coś więcej niż asany</Bold>
              <Italic>
                i chcesz zanurzyć się w medytacji, jodze nidrze, filozofii jogi
                czy cykliczności
              </Italic>
            </Statement>
            <Statement>
              <Bold>
                Jesteś na początku swojej drogi lub praktykujesz regularnie
              </Bold>
              <Italic>
                i chcesz praktykować z większą świadomością - z kompleksowym
                wprowadzeniem do jogi, omówieniem asan i koncepcji, które
                porządkują wiedzę
              </Italic>
            </Statement>
            <Brandmark className="size-64 -z-10 absolute -bottom-4 md:-bottom-0 -right-4 md:-right-0 md:-top-4 md:-left-4 text-primary-foreground" />
          </div>
        </div>
        <div className="relative flex flex-col items-center justify-center aspect-square w-full md:w-1/2 xl:w-1/3">
          <p className="text-2xl text-center font-light mb-6">
            Sprawdź za darmo, <br />
            zanim wykupisz subskrypcję
          </p>
          <Link
            className={cn(
              buttonVariants(),
              'flex rounded-full bg-richBlack text-matcha hover:text-richBlack text-lg h-12'
            )}
            href={'/rejestracja'}
          >
            3-dniowy okres próbny
          </Link>
          <Image
            src="/subscription_square.png"
            className="-z-10 object-cover rounded-[32px]"
            fill
            alt="Obrazek"
          />
        </div>
      </Container>
    </section>
  );
};

export default IsItForYou;
