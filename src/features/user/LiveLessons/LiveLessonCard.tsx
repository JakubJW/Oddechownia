'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Calendar, Clock, Video } from 'lucide-react';
import { LiveLessonCardUserDashboardDTO } from '@/server/models/liveLesson.models';
import { cn, formatTimeForInput } from '@/lib/utils';
import Link from 'next/link';

export function LiveLessonCard({
  title,
  duration,
  scheduledAt,
  status,
  description,
  meetingUrl,
  recordingUrl,
}: LiveLessonCardUserDashboardDTO) {
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

  return (
    <Card className="overflow-hidden relative flex flex-col transition-all hover:shadow-lg border-border">
      <div
        className="absolute top-0 w-full h-2"
        style={{
          background: 'linear-gradient(to right, #B9C499, #9EAFBF, #EBDFD3)',
        }}
      />
      <CardHeader className="grow">
        <div className="flex items-start justify-between gap-2">
          <CardTitle
            className="text-xl font-semibold text-balance leading-tight flex-1"
            style={{ color: '#00171F' }}
          >
            {title}
          </CardTitle>
          <div>
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
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(scheduledAt).toLocaleDateString('pl-PL', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {formatTimeForInput(scheduledAt)} • ({duration} min)
              </span>
            </div>
            {/* {participants !== undefined && (
              <div className="flex items-center gap-2 text-foreground">
                <Video className="h-4 w-4 text-muted-foreground" />
                <span>{participants} uczestników zapisanych</span>
              </div>
            )} */}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
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
              buttonVariants({ size: 'lg', variant: 'outline' }),
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
      </CardFooter>
    </Card>
  );
}
