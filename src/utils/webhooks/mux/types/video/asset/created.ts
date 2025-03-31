import { handleCreatedWebhook } from '@/actions/video';

type Props = {
  data: { [key: string]: any };
};

const handler = async ({ data }: Props) => {
  const { upload_id, playback_ids, status } = data;

  await handleCreatedWebhook({ uploadId: upload_id, playbackIds: playback_ids, status });
};

export default handler;
