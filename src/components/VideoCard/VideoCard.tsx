import MuxPlayer from '@mux/mux-player-react';

export interface VideoCardProps {
  id: number;
  title: string;
  description: string;
  duration: number;
  videoUrl: string;
}

export default function VideoCard({
  title,
  description,
  videoUrl,
}: VideoCardProps) {
  return (
    <div className="rounded-xl overflow-hidden bg-white">
      <MuxPlayer
        // poster={thumbnail}
        title={title}
        streamType="on-demand"
        playbackId={videoUrl}
        metadata={{
          video_series: title,
          video_title: title,
        }}
        accentColor="hsl(var(--matcha))"
      />
      <div className="p-4 bg-white">
        <p className="text-lg font-bold leading-normal mb-4 line-clamp-2">
          {title}
        </p>
        <p className="line-clamp-2 leading-normal">{description}</p>
      </div>
    </div>
  );
}
