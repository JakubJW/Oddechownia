import { handleReadyWebkook } from '@/actions/video';

type Props = {
  data: { [key: string]: any };
};

const handler = async ({ data }: Props) => {
  const { upload_id, playback_ids, duration, status, aspect_ratio } = data;

  await handleReadyWebkook({
    uploadId: upload_id,
    playbackIds: playback_ids,
    duration,
    aspectRatio: aspect_ratio,
    status,
  });
};

export default handler;
