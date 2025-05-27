import { db } from '@/db';
import { coursesToProfiles } from '@/db/schema';

type Props = {
  data: { [key: string]: any };
};

const handler = async ({ data }: Props) => {
  const { metadata } = data;

  await db.insert(coursesToProfiles).values({
    profileId: metadata.userId,
    courseId: metadata.courseId,
  });
};

export default handler;
