import Link from 'next/link';
import Image from 'next/image';
import { Clock, Film, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDuration } from '@/lib/utils';

interface CourseCardProps {
  title: string;
  description: string;
  slug: string;
  disabled: boolean;
  thumbnailUrl: string;
  totalVideos: number;
  totalDuration: number;
  isOneOff: boolean;
  priceInCents: number | null;
}

export default function CourseCard({
  title,
  description,
  slug,
  totalDuration,
  totalVideos,
  thumbnailUrl,
  disabled,
  isOneOff,
  priceInCents
}: CourseCardProps) {
  return (
    <Link
      className="rounded-xl bg-white overflow-hidden"
      href={disabled ? '/' : `/nasze-kursy/${slug}`} // probably implicit redirect to checkout or through middleware
    >
      <div className="relative">
        <Image
          src={thumbnailUrl}
          alt="Obraz"
          width={400}
          height={300}
          className="w-full h-[250px] object-cover"
        />
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
            <span className="leading-none">
              {formatDuration(totalDuration)}
            </span>
          </div>
        </div>
        {isOneOff && priceInCents && (
          <div className="absolute bottom-2 left-2">
            <div
              className={cn(
                disabled
                  ? 'bg-primaryFg text-primaryBg'
                  : 'bg-richBlack text-almond',
                'flex gap-2 items-center rounded-md p-2'
              )}
            >
              <ShoppingBag />
              <span className="leading-none">
                {(priceInCents / 100).toFixed(2)} zł
              </span>
            </div>
          </div>
        )}
        {disabled && (
          <div className="absolute top-0 left-0 w-full h-full bg-primaryBg opacity-60" />
        )}
      </div>

      <div className="flex flex-col p-6 gap-4">
        <p className="text-lg text-black font-bold line-clamp-2">{title}</p>
        <p className="text-gray-400 line-clamp-3">{description}</p>
      </div>
    </Link>
  );
}
