'use client';

import MuxPlayer from '@mux/mux-player-react';
import dynamic from 'next/dynamic';

interface VideoPlayerProps {
  playbackId?: string;
  videoSeries?: string;
  videoTitle?: string;
  thumbnail?: string;
}

const DynamicVideoPlayer = ({
  playbackId,
  videoSeries,
  videoTitle,
  thumbnail,
}: VideoPlayerProps) => {
  return (
    <div className=" mb-4 md:mb-8 md:rounded-xl overflow-hidden aspect-video">
      <MuxPlayer
        poster={thumbnail}
        title={videoTitle}
        streamType="on-demand"
        playbackId={playbackId}
        metadata={{
          video_series: videoSeries,
          video_title: videoTitle,
        }}
        accentColor="hsl(var(--matcha))"
      />
    </div>
  );
};

const VideoPlayer = dynamic(() => Promise.resolve(DynamicVideoPlayer), {
  ssr: false,
  loading: () => (
    <div className="-mx-4 md:mx-0 mb-8 w-full aspect-video rounded-xl animate-pulse bg-muted" />
  ),
});

export default VideoPlayer;
