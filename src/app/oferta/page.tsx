import Container from '@/components/Container/Container';
import { EbookCard } from '@/features/products/ebook-card';
import Kwiatek from '@/assets/Kwiatek.svg';
import Om from '@/assets/Om.svg';
import Sloneczko from '@/assets/Sloneczko.svg';
import { PurchasesRepository } from '@/server/purchases.repository';
import { GetVisibleProductsForUser } from '@/server/use-cases/get-visible-products-for-user';
import { SubscriptionRepository } from '@/server/subscription.repository';
import { ProductsRepository } from '@/server/products.repository';
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
        <div className="relative bg-gradient-to-r border border-matcha-foreground from-transparent to-matcha-light rounded-[32px] p-12 mb-12 overflow-hidden">
          <div>
            <h1 className="text-4xl font-light">Materiały</h1>
            <p className="mt-4 w-1/2 text-lg">
              Od 15-minutowych porannych rozruchów po głębokie sesje Yin Jogi.
              Dołącz do Oddechowni i odblokuj wszystkie nagrania.
            </p>
          </div>
          <Sloneczko className="absolute top-0 -translate-y-1/4 right-[15%] aspect-square h-[95%] text-matcha/60" />
          <Kwiatek className="absolute aspect-square top-1/2 -translate-y-1/2 right-[25%] -translate-x-1/2 h-full text-matcha/30" />
          <Om className="absolute bottom-0 translate-y-1/4 right-0 aspect-square h-[90%] text-matcha" />
        </div>
        <div className="grid grid-cols-4 gap-6 place-items-baseline">
          {products.map((product) => (
            <EbookCard
              key={product.id}
              title={product.name}
              slug={product.slug}
              includedInSubscription={product.isFreeForSubscribers}
              thumbnail={product.image}
              price={product.price}
              state={product.state}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
