import Container from '@/components/Container/Container';
import { GetEbookButton } from '@/features/products/get-ebook-button';
import { PRODUCT_CONTENTS } from '@/features/products/product-contents';
import { Params } from '@/types/types';
import Image from 'next/image';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getUser } from '@/server/actions/user';
import { notFound } from 'next/navigation';
import { GetProductForUser } from '@/application/use-cases/product/get-product-for-user';
import { ProductsRepository } from '@/infrastructure/repositories/products.repository';
import { PurchasesRepository } from '@/infrastructure/repositories/purchases.repository';
import { SubscriptionRepository } from '@/infrastructure/repositories/subscription.repository';

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

  const productContents = PRODUCT_CONTENTS[slug];

  return (
    <Container className="max-w-5xl">
      <section className="flex gap-16">
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
            {product.subscriberAccess === 'free_unlimited' &&
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
              productId={product.id}
              state={product.state}
            />
          </div>
        </div>
      </section>
    </Container>
  );
};

export default EbookDetails;
