'use client';

import MuxPlayer from '@mux/mux-player-react';
import dynamic from 'next/dynamic';

interface VideoPlayerProps {
  playbackId?: string;
  videoSeries?: string;
  videoTitle?: string;
}

const DynamicVideoPlayer = ({
  playbackId,
  videoSeries,
  videoTitle,
}: VideoPlayerProps) => {
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
        style={{ aspectRatio: 16 / 9 }}
      />
    </div>
  );
};

const VideoPlayer = dynamic(() => Promise.resolve(DynamicVideoPlayer), {
  ssr: false,
  loading: () => (
    <div className="mb-8 w-full aspect-video rounded-xl animate-pulse bg-white"></div>
  ),
});

export default VideoPlayer;
