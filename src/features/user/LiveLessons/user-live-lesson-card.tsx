import { cn, formatTimeForInput } from '@/lib/utils';
import { Calendar, Clock, Link, Video } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { LiveLessonCardUserDashboardDTO } from '@/server/models/liveLesson.models';

export const UserLiveLessonCard = ({
  title,
  duration,
  scheduledAt,
  status,
  description,
  meetingUrl,
  recordingUrl,
  thumbnail,
}: LiveLessonCardUserDashboardDTO) => {
  const statusStyles = {
    upcoming: { backgroundColor: '#B9C499', color: '#00171F' },
    live: { backgroundColor: '#9EAFBF', color: '#ffffff' },
    completed: { backgroundColor: '#EBDFD3', color: '#00171F' },
  };

  const statusText = {
    upcoming: 'Nadchodzące',
    live: 'Na żywo',
    completed: 'Zakończone',
  };

  console.log(status);

  return (
    <div className="lesson-card flex flex-col transition-all w-full duration-200 ease-in-out rounded-xl min-h-[350px] h-full overflow-hidden">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={thumbnail ? thumbnail : '/hero.jpg'}
          alt={`Miniatura lekcji ${title}`}
          fill
          className="lesson-card-thumbnail transition-all duration-200 ease-in-out object-cover"
        />
        <div className="absolute top-2 left-2 space-y-1">
          <Badge className="flex items-center gap-2">
            <Calendar className="size-4" />
            <span className="text-xsm">
              {new Date(scheduledAt).toLocaleDateString('pl-PL', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </Badge>
          <Badge className="flex items-center gap-2">
            <Clock className="size-4" />
            <span className="text-xs">
              {`${formatTimeForInput(scheduledAt)} (${duration} min)`}
            </span>
          </Badge>
        </div>
        <div className="absolute right-2 top-2">
          {status === 'live' && (
            <Badge
              className="shrink-0 items-center"
              style={statusStyles[status]}
            >
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span>{statusText[status]}</span>
            </Badge>
          )}
        </div>
      </div>
      <div className="flex flex-col flex-grow px-4 py-6 xl:px-6 gap-4">
        <p className="text-richBlack font-semibold line-clamp-2">{title}</p>
        <p className="text-sm  text-gray-400 line-clamp-4">{description}</p>
        {status === 'upcoming' && (
          <Button
            disabled
            size="lg"
            variant="default"
            className="w-full"
          >
            <Video className="mr-2 h-4 w-4" />
            Nadchodzące
          </Button>
        )}
        {status === 'live' && meetingUrl && (
          <Link
            href={meetingUrl}
            target="_blank"
            className={cn(buttonVariants({ size: 'lg' }), 'w-full')}
            style={{ backgroundColor: '#9EAFBF', color: '#ffffff' }}
          >
            <Video className="mr-2 h-4 w-4" />
            Dołącz teraz
          </Link>
        )}
        {status === 'completed' && !recordingUrl && (
          <Button
            disabled
            className={cn(
              buttonVariants({ size: 'lg', variant: 'secondary' }),
              'w-full'
            )}
          >
            Nagranie w przygotowaniu
          </Button>
        )}
        {status === 'completed' && recordingUrl && (
          <Link
            className={cn(
              buttonVariants({ size: 'lg', variant: 'outline' }),
              'w-full'
            )}
            target="_blank"
            href={recordingUrl}
          >
            Zobacz nagranie
          </Link>
        )}
      </div>
    </div>
  );
};
