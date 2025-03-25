import { db } from '@/db';
import { eq, and, not } from 'drizzle-orm';
import { videos } from '@/db/schema';

type PlaybackId = {
  id: string;
  policy: 'signed' | 'public';
};

type Props = {
  data: { [key: string]: any };
};

const handler = async ({ data }: Props) => {
  const { upload_id, playback_ids, status } = data;

  await db
    .update(videos)
    .set({
      publicPlaybackId: playback_ids.find(
        (row: PlaybackId) => row.policy === 'public'
      ).id,
      privatePlaybackId: playback_ids.find(
        (row: PlaybackId) => row.policy === 'signed'
      ).id,
      status,
    })
    .where(
      and(eq(videos.uploadId, upload_id), not(eq(videos.status, 'ready')))
    );
};

export default handler;
