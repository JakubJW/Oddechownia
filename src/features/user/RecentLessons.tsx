import Link from 'next/link';
import { cn, formatDuration } from '@/lib/utils';
import Image from 'next/image';
import { LessonsService } from '@/server/services/lessons.service';
import { ProgressBar } from '../shared/ProgressBar';

type Props = {
  lessons: Awaited<ReturnType<typeof LessonsService.getRecentlyWatchedLessons>>;
  className?: string;
};
export const RecentLessons = ({ lessons, className }: Props) => {
  return (
    <div className={cn('pt-[20px]', className)}>
      <p className="pl-4 mb-4">Kontynuuj praktykę</p>
      <div className="">
        {lessons.map((lesson) => (
          <Link
            key={lesson.id}
            href={`/studio-jogi-online/${lesson.playlist!.slug}/${lesson.slug}`}
          >
            <div className="lesson-playlist-card flex gap-4 p-4 rounded-lg relative transition-colors duration-300 hover:bg-primary-foreground">
              <div className="relative overflow-hidden rounded-lg flex-shrink-0">
                <Image
                  src={lesson.thumbnail}
                  width={150}
                  height={96}
                  alt={lesson.name}
                  className="aspect-video transition-transform duration-300"
                />
                <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs p-1 rounded-sm">
                  {formatDuration(lesson.video!.duration!)}
                </span>
                <ProgressBar percent={lesson.progress.percent} />
              </div>
              <p
                title={lesson.name}
                className="text-sm md:text-md font-light line-clamp-2 mb-auto"
              >
                {lesson.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
