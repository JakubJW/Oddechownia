import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { formatDuration } from '@/lib/utils';

interface CourseVideoCardProps {
  id: number;
  slug: string;
  duration: number | null;
  thumbnailUrl: string;
  title: string;
  description: string;
  videoPlaybackId: string | null;
}

export default function CourseVideoCard({
  id,
  slug,
  thumbnailUrl,
  title,
  duration,
  description,
  videoPlaybackId
}: CourseVideoCardProps) {
  return (
    <Link
      key={id}
      className="rounded-xl bg-white overflow-hidden relative"
      href={`/nasze-kursy/${slug}/video/${videoPlaybackId}`}
    >
      <div className="absolute top-2 left-2 space-y-2">
        <div className="flex gap-2 items-center bg-primaryBg text-primaryFg rounded-md p-2">
          <Clock />
          <span className="leading-none">{formatDuration(duration)}</span>
        </div>
      </div>
      <Image
        src={thumbnailUrl}
        alt="Obraz"
        width={400}
        height={300}
        className="w-full h-[200px] object-cover"
      />
      <div className="flex flex-col p-6 gap-4">
        <p className="text-lg text-black font-bold line-clamp-2">{title}</p>
        <p className="text-gray-400 line-clamp-3">{description}</p>
      </div>
    </Link>
  );
}
