'use client';

import MuxPlayer from '@mux/mux-player-react';

interface VideoPlayerProps {
  playbackId?: string;
  videoSeries?: string;
  videoTitle?: string;
}

export default function VideoPlayer({
  playbackId,
  videoSeries,
  videoTitle,
}: VideoPlayerProps) {
  return (
    <div className="mb-8 w-full aspect-video rounded-xl overflow-hidden">
      <MuxPlayer
        className="w-full aspect-video"
        streamType="on-demand"
        playbackId={playbackId}
        metadata={{
          video_series: videoSeries,
          video_title: videoTitle,
        }}
      />
    </div>
  );
}
