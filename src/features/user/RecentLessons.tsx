import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LessonsService } from '@/server/services/lessons.service';
import LessonCard from '@/components/LessonCard/LessonCard';
import { buttonVariants } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

type Props = {
  lessons: Awaited<ReturnType<typeof LessonsService.getRecentlyWatchedLessons>>;
  className?: string;
};
export const RecentLessons = ({ lessons, className }: Props) => {
  if (!lessons.length) {
    return (
      <div className={cn('pt-[20px] min-h-[350px] flex flex-col', className)}>
        <p className="font-light mb-4">Ostatnio oglądane</p>
        <div className="flex flex-col grow gap-4 rounded-lg items-center justify-center w-full bg-muted text-muted-foreground">
          <p>Tutaj pojawią się ostatnio oglądane praktyki.</p>
          <Link
            href={'/studio-jogi-online'}
            className={cn(buttonVariants({}))}
          >
            Przeglądaj playlisty <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('pt-[20px]', className)}>
      <p className="mb-4 font-light">Ostatnio oglądane</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {lessons.map((lesson) => (
          <Link
            key={lesson.id}
            href={`/studio-jogi-online/${lesson.playlist!.slug}/${lesson.slug}`}
          >
            <LessonCard
              thumbnail={lesson.thumbnail}
              name={lesson.name}
              description={lesson.description}
              video={lesson.video}
              labels={lesson.labels}
              percent={lesson.progress.percent}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};
