import { cn, formatDuration } from '@/lib/utils';
import { LessonDetailDTO } from '@/server/models/lesson.models';
import { Play } from 'lucide-react';
import { ProgressBar } from '../shared/ProgressBar';
import { LessonLabel } from '@/components/LessonLabel';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  playlistName: string;
  playlistSlug: string;
  lessonSlug: string;
  lessons: Array<
    LessonDetailDTO & {
      progress?: {
        isCompleted: boolean | undefined;
        lastPositionSeconds: number;
        percent: number;
      };
    }
  >;
  className?: string;
};

export const LessonsList = ({
  playlistName,
  playlistSlug,
  lessons,
  lessonSlug,
  className,
}: Props) => {
  return (
    <div className={cn(className)}>
      <div className="flex flex-col flex-1 lg:h-0 lg:min-h-full md:border md:rounded-xl bg-white">
        <h2 className="font-medium text-md p-6 line-clamp-2">{playlistName}</h2>
        <div className="flex-grow px-6 pb-6 overflow-y-scroll">
          {lessons.map(
            ({ id, video, name, slug, thumbnail, progress, labels }) => (
              <Link
                key={id}
                href={`/studio-jogi-online/${playlistSlug}/${slug}`}
              >
                <div
                  className={cn(
                    'lesson-playlist-card flex gap-4 -mx-6 px-6 py-2 relative transition-colors duration-300',
                    slug === lessonSlug
                      ? 'bg-matcha-foreground'
                      : 'hover:bg-matcha-light'
                  )}
                >
                  <div className="relative overflow-hidden rounded-lg flex-shrink-0">
                    <div
                      className={cn(
                        'lesson-playlist-card-play-overlay z-10 transition-opacity duration-300 flex items-center justify-center absolute h-full w-full top-0 left-0',
                        slug === lessonSlug ? 'opacity-1' : 'opacity-0'
                      )}
                    >
                      <div className="bg-matcha-foreground text-richBlack rounded-full p-4">
                        <Play className="size-4" />
                      </div>
                    </div>
                    <Image
                      src={thumbnail}
                      width={150}
                      height={96}
                      alt={name}
                      className="aspect-video object-cover transition-transform duration-300"
                    />
                    <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs p-1 rounded-sm">
                      {formatDuration(video?.duration)}
                    </span>
                    <ProgressBar percent={progress?.percent || 0} />
                  </div>
                  <div className="flex flex-col">
                    <p
                      title={name}
                      className="text-sm sm:text-base line-clamp-2 mb-2"
                    >
                      {name}
                    </p>
                    <div className="flex gap-1">
                      {labels.map((label) => (
                        <LessonLabel
                          key={label.id}
                          label={{ text: label.text, color: label.color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
};
