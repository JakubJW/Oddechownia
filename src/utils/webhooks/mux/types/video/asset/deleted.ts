import { deleteVideo } from '@/actions/video';

type Props = {
  data: { [key: string]: any };
};

const handler = async ({ data }: Props) => {
  const { upload_id } = data;

  await deleteVideo({ uploadId: upload_id });
};

export default handler;
