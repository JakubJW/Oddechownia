import Container from '@/components/Container/Container';
import { EbookCard } from '@/features/products/ebook-card';
import Kwiatek from '@/assets/Kwiatek.svg';
import Om from '@/assets/Om.svg';
import Sloneczko from '@/assets/Sloneczko.svg';
import { PurchasesRepository } from '@/infrastructure/repositories/purchases.repository';
import { GetVisibleProductsForUser } from '@/application/use-cases/product/get-visible-products-for-user';
import { SubscriptionRepository } from '@/infrastructure/repositories/subscription.repository';
import { ProductsRepository } from '@/infrastructure/repositories/products.repository';
import { getUser } from '@/server/actions/user';

export default async function Products() {
  const user = await getUser();

  const useCase = new GetVisibleProductsForUser(
    new ProductsRepository(),
    new PurchasesRepository(),
    new SubscriptionRepository()
  );

  const products = await useCase.execute(user?.id);

  return (
    <section>
      <Container>
        {/* <div className="relative bg-gradient-to-r border border-matcha-foreground from-transparent to-matcha-light rounded-[32px] p-12 mb-12 overflow-hidden">
          <Sloneczko className="absolute z-0 top-0 -translate-y-1/4 right-[15%] aspect-square h-[50%] sm:h-[95%] text-matcha/60" />
          <Kwiatek className="absolute z-0 aspect-square top-1/2 -translate-y-1/2 right-[25%] -translate-x-1/2 h-[60%] sm:h-full text-matcha/30" />
          <Om className="absolute bottom-0 translate-y-1/4 right-0 aspect-square h-[50%] sm:h-[90%] text-matcha" />
          <div className="relative z-10">
            <h1 className="text-4xl font-light">Produkty</h1>
            <p className="mt-4 sm:w-1/2 text-lg">
              Od 15-minutowych porannych rozruchów po głębokie sesje Yin Jogi.
              Dołącz do Oddechowni i odblokuj wszystkie nagrania.
            </p>
          </div>
        </div> */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 place-items-baseline">
          {products.map((product) => (
            <EbookCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              subscriberAccess={product.subscriberAccess}
              image={product.image}
              price={product.price}
              state={product.state}
              disabled={product.disabled}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
