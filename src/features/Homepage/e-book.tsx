import { HeaderTwo } from '@/components/Headers/headers';
import Container from '@/components/Container/Container';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Brandmark from '@/assets/Brandmark.svg';

export default async function EBook() {
  return (
    <section className="relative bg-primary-foreground">
      <Container className="relative z-10 flex flex-col md:flex-row gap-6 justify-center">
        <div className="flex-1">
          <Image
            src="/ebook.png"
            width={600}
            height={320}
            alt="ebook cover"
            className="rounded-[32px]"
          />
        </div>
        <div className="flex flex-col justify-center flex-1">
          <hgroup className="text-center md:text-left">
            <HeaderTwo className="mb-8 font-light">
              Wiedza, która zostanie z tobą na zawsze
            </HeaderTwo>
            <p className="mb-6 text-xl leading-relaxed font-light">
              Pogłębiaj swoją praktykę dzięki naszemu nowemu e-bookowi{' '}
              <i>[Tytuł]</i>. To kompendium wiedzy o [Temat], które pomoże Ci
              zrozumieć <i>[Korzyść]</i>.
            </p>
          </hgroup>
          <Link
            className={cn(
              buttonVariants({ size: 'lg' }),
              'self-center md:self-start rounded-full text-xl h-12 mb-4'
            )}
            href={'/produkty'}
          >
            Zobacz szczegóły
          </Link>
        </div>
      </Container>
    </section>
  );
}
