import Link from 'next/link';
import Image from 'next/image';
import { Clock, Film } from 'lucide-react';
import { cn, formatDuration } from '@/lib/utils';

interface CourseCardProps {
  id: number;
  title: string;
  description: string;
  slug: string;
  totalVideos: number;
  totalDuration: number;
  thumbnailUrl: string;
  disabled: boolean;
}

export default function CourseCard({
  id,
  title,
  description,
  slug,
  totalDuration,
  totalVideos,
  thumbnailUrl,
  disabled,
}: CourseCardProps) {
  return (
    <Link
      key={id}
      className="rounded-xl bg-white overflow-hidden relative"
      href={disabled ? '/' : `/nasze-kursy/${slug}`} // probably implicit redirect to checkout or through middleware
    >
      <Image
        src={thumbnailUrl}
        alt="Obraz"
        width={400}
        height={300}
        className="w-full h-[250px] object-cover"
      />
      {disabled && (
        <div className="absolute top-0 left-0 w-full h-[250px] bg-primaryBg opacity-60" />
      )}
      <div className="absolute top-2 left-2 space-y-2">
        <div
          className={cn(
            disabled
              ? 'bg-primaryFg text-primaryBg'
              : 'bg-primaryBg text-primaryFg',
            'flex gap-2 items-center rounded-md p-2'
          )}
        >
          <Film />
          <span className="leading-none">{totalVideos} filmów</span>
        </div>
        <div
          className={cn(
            disabled
              ? 'bg-primaryFg text-primaryBg'
              : 'bg-primaryBg text-primaryFg',
            'flex gap-2 items-center rounded-md p-2'
          )}
        >
          <Clock />
          <span className="leading-none">{formatDuration(totalDuration)}</span>
        </div>
      </div>

      <div className="flex flex-col p-6 gap-4">
        <p className="text-lg text-black font-bold line-clamp-2">{title}</p>
        <p className="text-gray-400 line-clamp-3">{description}</p>
      </div>
    </Link>
  );
}
