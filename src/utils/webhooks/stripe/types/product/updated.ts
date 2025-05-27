import { db } from '@/db';
import { stripeProducts } from '@/db/schema';
import { eq } from 'drizzle-orm';

type Props = {
  data: { [key: string]: any };
};

const handler = async ({ data }: Props) => {
  const { id, name, description, active, marketing_features } = data;

  await db
    .update(stripeProducts)
    .set({
      name,
      description,
      active,
      marketingFeatures: marketing_features,
    })
    .where(eq(stripeProducts.stripeProductId, id));
};

export default handler;
