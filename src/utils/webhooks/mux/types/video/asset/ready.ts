import { db } from '@/db';
import { videos } from '@/db/schema';
import { eq } from 'drizzle-orm';

type PlaybackId = {
  id: string;
  policy: 'signed' | 'public';
};

type Props = {
  data: { [key: string]: any };
};

const handler = async ({ data }: Props) => {
  const { upload_id, playback_ids, duration, status, aspect_ratio } = data;

  // update video record
  await db
    .update(videos)
    .set({
      publicPlaybackId: playback_ids.find(
        (row: PlaybackId) => row.policy === 'public'
      ).id,
      privatePlaybackId: playback_ids.find(
        (row: PlaybackId) => row.policy === 'signed'
      ).id,
      duration,
      aspectRatio: aspect_ratio,
      status,
    })
    .where(eq(videos.uploadId, upload_id));
};

export default handler;
