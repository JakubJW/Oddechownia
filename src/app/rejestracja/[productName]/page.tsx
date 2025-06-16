import RegisterForm from '@/features/Register/Form/RegisterForm';
import Container from '@/components/Container/Container';
import Order from '@/features/Register/Order/Order';
import { db } from '@/db';
import { stripeProducts } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound, redirect } from 'next/navigation';
import { getProfile } from '@/actions/profile';

export default async function SignIn({
  params,
}: {
  params: Promise<{ productName: string }>;
}) {
  const profile = await getProfile();
  if (profile) {
    redirect('/moje-konto');
  }

  const { productName } = await params;
  const stripeProduct = await db.query.stripeProducts.findFirst({
    where: eq(stripeProducts.name, productName),
    with: {
      stripePrice: true,
    },
  });

  if (!stripeProduct) {
    notFound();
  }

  return (
    <section>
      <Container className="pt-6 pb-32">
        <div className="grid grid-cols-12 gap-24">
          <RegisterForm stripeProductId={stripeProduct?.stripeProductId} />
          <Order stripeProduct={stripeProduct} />
        </div>
      </Container>
    </section>
  );
}
