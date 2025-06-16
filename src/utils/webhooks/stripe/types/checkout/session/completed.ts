import { db } from '@/db';
import { coursesToProfiles } from '@/db/schema';
import { profiles } from '@/db/schema';
import { eq } from 'drizzle-orm';

type Props = {
  data: { [key: string]: any };
};

const handler = async ({ data }: Props) => {
  const { metadata, mode, client_reference_id, customer } = data;

  if (mode === 'payment') {
    await db.insert(coursesToProfiles).values({
      profileId: metadata.userId,
      courseId: metadata.courseId,
    });
  } else if (mode === 'subscription') {
    await db
      .update(profiles)
      .set({
        subscriptionStatus: 'active',
        stripeCustomerId: customer,
      })
      .where(eq(profiles.id, client_reference_id));
  }
};

export default handler;
