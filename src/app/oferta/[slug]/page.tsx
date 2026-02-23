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
        <Container className="flex gap-16 max-w-5xl">
          <div className="flex-1">
            <Image
              className="rounded-[32px]"
              src={product.image}
              width={1310}
              height={2046}
              alt=""
            />
          </div>
          <div className="flex-1 space-y-4">
            <hgroup>
              <h1 className="text-4xl leading-relaxed font-light">
                {productContents.hero.title}
              </h1>
              <p className="text-base mt-4">{productContents.hero.subtitle}</p>
            </hgroup>
            <p>
              Dołącz do Oddechowni, rozpocznij 3-dniowy okres próbny i odbierz
              e-booka jako za darmo przy pierwszej miesięcznej subskrypcji.
            </p>
            <div className="flex flex-col gap-4">
              {(product.subscriberAccess === 'free_unlimited' ||
                product.subscriberAccess === 'quota_based') &&
                product.state === 'can_purchase' && (
                  <Link
                    href="/rejestracja"
                    className={cn(
                      buttonVariants({ size: 'lg' }),
                      'bg-matcha text-richBlack'
                    )}
                  >
                    Rozpocznij okres próbny
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
      {productContents.sections.map((section, index) => {
        if (section.type === 'list') {
          return (
            <section
              key={index}
              className={cn(index % 2 === 0 && 'bg-matcha-light')}
            >
              <Container className="max-w-5xl">
                <h2 className="text-3xl mb-8 font-light">{section.heading}</h2>
                <ul className="list-disc list-inside text-lg font-light space-y-2">
                  {section.bulletPoints?.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </Container>
            </section>
          );
        }

        if (section.type === 'text') {
          return (
            <section key={index}>
              <Container className="max-w-5xl">
                <h2 className="text-3xl mb-8 font-light">{section.heading}</h2>
                {section.paragraphs?.map((point, index) => (
                  <p
                    key={index}
                    className="text-lg font-light mb-4"
                  >
                    {point}
                  </p>
                ))}
              </Container>
            </section>
          );
        }
      })}
    </>
  );
};

export default EbookDetails;
