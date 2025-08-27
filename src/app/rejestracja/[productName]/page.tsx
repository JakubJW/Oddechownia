import RegisterForm from '@/features/Register/Form/RegisterForm';
import Container from '@/components/Container/Container';
import Order from '@/features/Register/Order/Order';
import { notFound } from 'next/navigation';
import { getSubscriptionBySlug } from '@/actions/product';
// import { getUser } from '@/actions/user';
// import { redirect } from 'next/navigation';

export default async function SignIn({
  params,
}: {
  params: Promise<{ productName: string }>;
}) {
  const { productName } = await params;
  // const user = await getUser();

  // if (user && user.subscriptionStatus === 'active') {
  //   redirect('/moje-konto');
  // }

  const stripeProduct = await getSubscriptionBySlug(productName);

  if (!stripeProduct) {
    notFound();
  }

  return (
    <section>
      <Container className="pt-6 pb-32">
        <div className="grid grid-cols-12 gap-24">
          <RegisterForm stripeProductId={stripeProduct.stripeProductId} />
          <Order stripeProduct={stripeProduct} />
        </div>
      </Container>
    </section>
  );
}
