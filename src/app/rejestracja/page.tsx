import Container from '@/components/Container/Container';
import RegisterForm from '@/features/Register/Form/RegisterForm';
import Order from '@/features/Register/Order/Order';
import { BillingService, SubscriptionProductDTO } from '@/server/services/billing.service';
import { SearchParams } from '@/types/types';

export default async function SignIn({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query = await searchParams;

  const priceId = query.priceId as string;
  let productToDisplay: SubscriptionProductDTO | undefined;

  if (priceId) {
    try {
      const products = await BillingService.getActiveSubscriptionProducts();

      productToDisplay = products.find((p) => p.priceId === priceId);
    } catch (error) {
      console.error('Failed to fetch product intent:', error);
    }
  }

  return (
    <section>
      <Container className="pt-6 pb-32">
        <div className="grid grid-cols-12 gap-24">
          <RegisterForm priceId={priceId} />
          {productToDisplay ? (
            <Order
              features={productToDisplay.features}
              amount={productToDisplay.amount}
              interval={productToDisplay.interval}
              intervalCount={productToDisplay.intervalCount}
            />
          ) : (
            <div className='col-span-6'>
              Za pomocą tego formularza możesz zarejestrować się w Oddechowni.
              Plan subskrypcji będziesz mógł wybrać później.
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
