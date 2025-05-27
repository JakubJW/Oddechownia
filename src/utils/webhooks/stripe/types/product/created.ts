import { db } from '@/db';
import { stripeProducts } from '@/db/schema';

type Props = {
  data: { [key: string]: any };
};

const handler = async ({ data }: Props) => {
  const { id, name, description, active, marketing_features } = data;

  console.log(data);

  await db.insert(stripeProducts).values({
    stripeProductId: id,
    name,
    description,
    active,
    marketingFeatures: marketing_features,
  });
};

export default handler;
