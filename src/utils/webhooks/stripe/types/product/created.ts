import { db } from '@/db';
import { stripeProducts } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { createSlug } from '@/lib/utils';

type Props = {
  data: { [key: string]: unknown };
};

const handler = async ({ data }: Props) => {
  const { id, name, description, active, marketing_features } = data;

  await db.insert(stripeProducts).values({
    stripeProductId: id,
    name: createSlug(name),
    description,
    active,
    marketingFeatures: marketing_features,
  });

  revalidatePath('/');
};

export default handler;
