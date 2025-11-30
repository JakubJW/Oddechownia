'use client';

import { useRef } from 'react';
import MuxPlayer from '@mux/mux-player-react';
import dynamic from 'next/dynamic';
import { useProgressMutation } from './hooks/useProgressMutation';

interface LessonPlayerProps {
  playbackId?: string;
  lessonId: number;
  playlistId?: number;
  videoSeries?: string;
  videoTitle?: string;
  thumbnail?: string;
  startTime?: number;
}

const DynamicLessonPlayer = ({
  playbackId,
  lessonId,
  playlistId,
  videoSeries,
  videoTitle,
  thumbnail,
  startTime = 0,
}: LessonPlayerProps) => {
  const lastSaveTime = useRef(0);
  const THROTTLE_MS = 10000;

  const { mutate } = useProgressMutation();

  const handleTimeUpdate = (evt: Event) => {
    const video = evt.target as HTMLVideoElement;
    if (!video.duration) return;

    const now = Date.now();

    if (now - lastSaveTime.current > THROTTLE_MS) {
      lastSaveTime.current = now;

      mutate({
        lessonId,
        seconds: video.currentTime,
        totalDuration: video.duration,
        playlistId,
      });
    }
  };

  return (
    <div className="mb-4 md:mb-8 md:rounded-xl overflow-hidden aspect-video">
      <MuxPlayer
        poster={thumbnail}
        title={videoTitle}
        streamType="on-demand"
        playbackId={playbackId}
        startTime={startTime}
        metadata={{ video_series: videoSeries, video_title: videoTitle }}
        accentColor="hsl(var(--matcha))"
        onTimeUpdate={handleTimeUpdate}
        onEnded={(e) => {
          const v = e.target as HTMLVideoElement;
          mutate({
            lessonId,
            seconds: v.duration,
            totalDuration: v.duration,
            playlistId,
          });
        }}
      />
    </div>
  );
};

const LessonPlayer = dynamic(() => Promise.resolve(DynamicLessonPlayer), {
  ssr: false,
  loading: () => (
    <div className="-mx-4 md:mx-0 mb-8 w-full aspect-video rounded-xl animate-pulse bg-muted" />
  ),
});

export default LessonPlayer;
