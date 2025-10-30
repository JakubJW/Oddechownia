import Image from 'next/image';
import { cn, formatDuration } from '@/lib/utils';
import { Play } from 'lucide-react';

export const Playlist = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full border rounded-xl p-6 bg-white">{children}</div>
  );
};

export const PlaylistName = ({ children }: { children: React.ReactNode }) => {
  return <p className="font-semibold text-lg mb-4">{children}</p>;
};

export const PlaylistContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div>{children}</div>;
};

export const PlaylistLesson = ({
  isActive,
  children,
}: {
  isActive: boolean;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        isActive && 'bg-primaryBg',
        'flex gap-4 -mx-6 px-6 py-2 relative'
      )}
    >
      {isActive && (
        <Play className="absolute top-1/2 -translate-y-1/2 left-1 text-richBlack h-4 w-4 flex-shrink-0" />
      )}
      {children}
    </div>
  );
};

export const PlaylistLessonImage = ({
  src,
  alt,
  duration,
}: {
  src: string;
  alt: string;
  duration?: number;
}) => {
  return (
    <div className="relative flex-shrink-0">
      <Image
        src={src}
        width={150}
        height={96}
        alt={alt}
        className="rounded-lg aspect-video"
      />
      <span className="absolute bottom-2 right-2 bg-black text-white text-xs p-1 rounded-sm">
        {formatDuration(duration)}
      </span>
    </div>
  );
};

export const PlaylistLessonName = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <p className="font-bold">{children}</p>;
};
