import { VideoDTO, VideoSchema } from '../models/video.models';

export const transformVideoToDto = (
  video: VideoSchema | null
): VideoDTO | undefined => {
  return video
    ? {
        ...video,
        publicPlaybackId: video.publicPlaybackId ?? undefined,
        privatePlaybackId: video.privatePlaybackId ?? undefined,
        duration: video.duration ?? undefined,
        aspectRatio: video.aspectRatio ?? undefined,
      }
    : undefined;
};
