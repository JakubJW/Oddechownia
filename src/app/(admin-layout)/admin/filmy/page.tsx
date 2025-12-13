import { muxService } from '@/server/services/mux.service';
import VideoPlayer from '@/features/shared/VideoPlayer';

export default async function Videos() {
  const assets = await muxService.listAssets();

  return (
    <div>
      {assets!.data.map((asset) => (
        <VideoPlayer
          key={asset.id}
          playbackId={
            asset.playback_ids?.find((playback) => playback.policy === 'public')
              ?.id
          }
        />
      ))}
    </div>
  );
}
