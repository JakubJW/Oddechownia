import { cn } from '@/lib/utils';
import { formatDuration } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { Play } from 'lucide-react';

interface PlaylistElementProps {
  name: string;
  duration: number | null;
  isActive: boolean;
  thumbnailUrl: string;
  videoPlaybackId: string | null;
  courseSlug: string;
}

export default function PlaylistElement({
  name,
  duration,
  isActive,
  thumbnailUrl,
  videoPlaybackId,
  courseSlug,
}: PlaylistElementProps) {
  return (
    <Link
      href={`/nasze-kursy/${courseSlug}/video/${videoPlaybackId}`}
      className={cn(
        isActive && 'bg-primaryBg',
        'flex gap-4 -mx-6 px-6 py-2 relative'
      )}
    >
      {isActive && (
        <Play className="absolute top-1/2 -translate-y-1/2 left-1 text-primaryFg h-4 w-4 flex-shrink-0" />
      )}
      <div className="relative flex-shrink-0">
        <Image
          src={thumbnailUrl}
          width={150}
          height={96}
          alt={`${name} lesson thumbnail`}
          className="rounded-lg aspect-video"
        />
        <span className="absolute bottom-2 right-2 bg-black text-white text-xs p-1 rounded-sm">
          {formatDuration(duration)}
        </span>
      </div>
      <div>
        <p className="font-bold">{name}</p>
      </div>
    </Link>
  );
}
