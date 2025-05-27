import { db } from '@/db';
import { stripeProducts } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

type Props = {
  data: { [key: string]: any };
};

const handler = async ({ data }: Props) => {
  const { id, name, description, active, marketing_features } = data;

  const result = await db
    .update(stripeProducts)
    .set({
      name,
      description,
      active,
      marketingFeatures: marketing_features,
    })
    .where(eq(stripeProducts.stripeProductId, id))
    .returning({ updatedIds: stripeProducts.stripeProductId });

  console.log('attempring path revalidation');
  revalidatePath('/');
	console.log('path revalidation completed');

  if (!result.length) {
    throw new Error('Subscription with given ID not found');
  }
};

export default handler;
