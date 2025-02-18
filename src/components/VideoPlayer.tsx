// components/VideoPlayer.tsx
"use client";

import React, { useRef, useEffect } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

interface VideoPlayerProps {
  src: string;       //URL to video file
  type: string;      //Video MIME type: 'application/x-mpegURL',
  options?: videojs.PlayerOptions;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, type, options }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<videojs.Player | null>(null);

  useEffect(() => {
    // Make sure Video.js is loaded before accessing videojs
    if (!videojs) {
        console.error("Video.js library not loaded correctly.");
        return;
    }

    const videoElement = videoRef.current;
    if (!videoElement) {
      console.warn("Video element not available. Please check the element's reference.");
      return;
    }

    const player = playerRef.current = videojs(videoElement, {
      controls: true,
      preload: 'auto',
      fluid: true, // Responsive video
      sources: [{
        src: src,
        type: type
      }],
      ...options
    }, () => {
      console.log('player is ready');
    });

    return () => {
      if (player) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [src, type, options]);

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-default-skin" />
    </div>
  );
};

export default VideoPlayer;