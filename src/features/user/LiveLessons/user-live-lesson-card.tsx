import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { LiveLessonStatus } from '@/entities/models/live-lesson';
import { cn, formatTimeForInput } from '@/lib/utils';
import { Calendar, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type UserLiveLessonCardProps = {
  title: string;
  description?: string;
  image: string;
  scheduledAt: string;
  duration: number;
  meetingLink?: string;
  recordingUrl?: string;
  status: LiveLessonStatus;
};

export const UserLiveLessonCard = ({
  title,
  duration,
  scheduledAt,
  status,
  description,
  meetingLink,
  recordingUrl,
  image,
}: UserLiveLessonCardProps) => {
  const statusStyles = {
    upcoming: { backgroundColor: '#B9C499', color: '#00171F' },
    live: 'bg-white text-red-500',
    completed: { backgroundColor: '#EBDFD3', color: '#00171F' },
  };

  return (
    <div className="lesson-card flex flex-col transition-all w-full duration-200 ease-in-out rounded-xl min-h-[350px] h-full overflow-hidden">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={image ? image : '/hero.jpg'}
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
          {status === LiveLessonStatus.LIVE && (
            <Badge
              className={cn('shrink-0 items-center', statusStyles[status])}
            >
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
              </span>
              <span>W trakcie</span>
            </Badge>
          )}
        </div>
      </div>
      <div className="flex flex-col flex-grow px-4 py-6 xl:px-6 gap-4">
        <p className="text-richBlack font-semibold line-clamp-2">{title}</p>
        <p className="text-sm  text-gray-400 line-clamp-4">{description}</p>
        {status === LiveLessonStatus.UPCOMING && (
          <Button
            disabled
            size="lg"
            variant="default"
            className="w-full mt-auto"
          >
            Nadchodzące
          </Button>
        )}
        {status === LiveLessonStatus.LIVE && meetingLink && (
          <Link
            href={meetingLink}
            target="_blank"
            className={cn(buttonVariants({ size: 'lg' }), 'mt-auto')}
          >
            Dołącz do spotkania
          </Link>
        )}
        {status === LiveLessonStatus.PROCESSING && !recordingUrl && (
          <Button
            disabled
            className={cn('mt-auto')}
            size="lg"
          >
            Przygotowywanie nagrania
          </Button>
        )}
        {status === LiveLessonStatus.COMPLETED && recordingUrl && (
          <Link
            className={cn(buttonVariants({ size: 'lg' }), 'mt-auto')}
            target="_blank"
            href={recordingUrl}
          >
            Obejrzyj nagranie
          </Link>
        )}
      </div>
    </div>
  );
};
