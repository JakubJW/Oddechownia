import Container from '@/components/Container/Container';
import { GetEbookButton } from '@/features/products/get-ebook-button';
import { PRODUCT_CONTENTS } from '@/features/products/product-contents';
import { Params } from '@/types/types';
import Image from 'next/image';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { getUser } from '@/server/actions/user';
import { notFound } from 'next/navigation';
import { GetProductForUser } from '@/application/use-cases/product/get-product-for-user';
import { ProductsRepository } from '@/infrastructure/repositories/products.repository';
import { PurchasesRepository } from '@/infrastructure/repositories/purchases.repository';
import { SubscriptionRepository } from '@/infrastructure/repositories/subscription.repository';
import { cn } from '@/lib/utils';
import Carousel from '@/components/Carousel/Carousel';

const EbookDetails = async ({
  params,
}: {
  params: Params<{ slug: string }>;
}) => {
  const { slug } = await params;
  const user = await getUser();

  const useCase = new GetProductForUser(
    new ProductsRepository(),
    new PurchasesRepository(),
    new SubscriptionRepository()
  );

  const product = await useCase.execute(slug, user?.id);

  if (!product) {
    notFound();
  }

  const productContents = PRODUCT_CONTENTS['energetyka-kobiecego-ciala'];

  return (
    <>
      <section>
        <Container className="pt-0 md:pt-16 grid grid-cols-4 gap-16 max-w-5xl">
          <div className="-mx-4 md:-mx-0 col-span-4 md:col-span-2">
            <Carousel
              hideArrows
              settings={{
                infinite: false,
                speed: 500,
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
                dots: true,
                responsive: [
                  {
                    breakpoint: 640,
                    settings: {
                      slidesToShow: 1,
                      slidesToScroll: 1,
                      infinite: false,
                    },
                  },
                  {
                    breakpoint: 1280,
                    settings: {
                      slidesToShow: 1,
                      slidesToScroll: 1,
                      infinite: false,
                    },
                  },
                ],
              }}
            >
              {productContents.images.map((image) => (
                <Image
                  key={image}
                  className="md:rounded-[32px] object-cover flex-grow"
                  src={image}
                  width={1080}
                  height={1350}
                  alt=""
                />
              ))}
            </Carousel>
          </div>
          <div className="mt-8 md:mt-0 col-span-4 md:col-span-2 space-y-4">
            <hgroup>
              <h1 className="text-3xl md:text-4xl font-light">
                {productContents.hero.title}
              </h1>
            </hgroup>
            <p className="font-light">
              System energetyczny i czakry to rzeczywistość, której nie da się
              zważyć ani zmierzyć tradycyjnymi narzędziami, ale którą można
              głęboko odczuwać i przeżywać. To mądrość obecna w jodze od tysięcy
              lat, którą współczesna nauka, psychologia i neurobiologia dopiero
              zaczynają odkrywać i badać.
            </p>

            <p className="font-light">
              Kluczowym elementem e-booka jest kompletny, 14-tygodniowy plan
              pracy z systemem energetycznym, który przeprowadzi Cię krok po
              kroku przez każde z siedmiu centrów mocy. To nie są czasochłonne
              ćwiczenia, ale proste (choć istotne) rytuały wplecione w Twój plan
              dnia, dostosowane do współczesnego trybu życia.
            </p>

            {(product.subscriberAccess === 'free_unlimited' ||
              product.subscriberAccess === 'quota_based') && (
              <p className="font-medium">
                Dołącz do Oddechowni i odbierz e-booka za darmo lub kup teraz.
              </p>
            )}
            <div className="space-x-2">
              {!user && (
                <Link
                  href="/rejestracja"
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'bg-matcha text-richBlack'
                  )}
                >
                  Przejdź do rejestracji
                </Link>
              )}
              <GetEbookButton
                price={product.price}
                productId={product.id}
                state={product.state}
              />
            </div>
          </div>
        </Container>
      </section>
      <Container className="max-w-5xl">
        <h2 className="text-xl mb-4">Opis</h2>
        <p className="font-light">
          Odkryj{' '}
          <strong>
            ponad 180 stron mądrości płynącej z wielotysięcznej tradycji jogi i
            tantry
          </strong>
          , zaadaptowanej do realiów współczesnej kobiety. Ten e-book to
          kompletna <strong>mapa Twojej wewnętrznej energetyki</strong>, która
          przeprowadzi Cię od zrozumienia fundamentów anatomii subtelnej aż po
          głęboką, osobistą transformację. Dowiesz się, w jaki sposób Twoje
          ciało energetyczne determinuje codzienne wybory, jakość relacji i stan
          emocjonalny, a następnie nauczysz się świadomie tym zarządzać.
          Odkryjesz system <strong>siedmiu głównych czakr</strong>{' '}
          przefiltrowany przez unikalne, kobiece doświadczenia oraz zgłębisz
          strukturę <strong>pięciu powłok (pańćakośa)</strong>, by krok po kroku
          docierać do swojego prawdziwego Ja. Poznasz również tajniki
          <strong> Prany i jej pięciu przepływów (vayus)</strong>, co pozwoli Ci
          realnie wspierać procesy ekspresji i naturalnego oczyszczania
          organizmu.
        </p>
        <h2 className="text-xl mt-6">Ten e-book jest dla Ciebie, jeśli…</h2>
        <ul className="space-y-2 mt-4 list-inside list-disc font-light">
          <li>
            czujesz, że działasz wbrew swojej naturze i chcesz wreszcie zacząć
            żyć w rytmie swojej cykliczności,
          </li>
          <li>
            pragniesz zrozumieć i uwolnić stare historie zapisane w ciele,
            traumy rodowe i napięcia, których nie potrafisz wyjaśnić logicznie,
          </li>
          <li>
            chcesz przestać żyć w ciągłym lęku i odzyskać poczucie
            bezpieczeństwa,
          </li>
          <li>
            pragniesz dać sobie wewnętrzne przyzwolenie do odczuwania i
            doświadczania przyjemności,
          </li>
          <li>
            chcesz nauczyć się słuchać głosu intuicji i ufać sygnałom płynącym z
            ciała,
          </li>
          <li>
            pragniesz nauczyć się mówić własnym głosem, wyznaczać granice i z
            odwagą stawać w swojej prawdzie bez lęku przed oceną,
          </li>
          <li>
            chcesz pogłębić praktykę jogi o wiedzę teoretyczną, która wykracza
            poza ćwiczenia fizyczne na macie
          </li>
        </ul>
        <p className="mt-4 font-light">
          Wyrusz w tę podróż i odważ się żyć w pełni swojej kobiecej mocy.
        </p>
      </Container>
    </>
  );
};

export default EbookDetails;
