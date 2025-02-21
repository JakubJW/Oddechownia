import { Clock } from 'lucide-react';
import Video from 'next-video';
import getStarted from '@/../videos/get-started.mp4';

export interface VideoCardProps {
  title: string;
  description: string;
  duration: number;
  videoUrl: string;
}

const formatDutaion = (duration: number) => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  return `${hours < 10 ? '0' + hours : hours}:${
    minutes < 10 ? '0' + minutes : minutes
  }:${seconds < 10 ? '0' + seconds : seconds}`;
};

export default function VideoCard({
  title,
  description,
  duration,
  videoUrl,
}: VideoCardProps) {
  return (
    <div className="relative rounded-xl overflow-hidden">
      <Video src={getStarted} />;
      <div className="absolute top-2 left-2 inline-flex items-center gap-2 p-2 rounded-md bg-primaryBg">
        <Clock className="text-primaryFg" />
        <span className="text-black leading-none">
          {formatDutaion(duration)}
        </span>
      </div>
      <div className="p-4 bg-white">
        <p className="text-lg font-bold leading-normal mb-4 line-clamp-2">{title}</p>
        <p className='line-clamp-2 leading-normal'>{description}</p>
      </div>
    </div>
  );
}
