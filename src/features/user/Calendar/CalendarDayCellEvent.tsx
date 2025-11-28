import {
  CalendarEvent,
  LiveLessonEvent,
} from '@/server/services/calendar.service';
import { cn } from '@/lib/utils';
import { CircleAlert, Video } from 'lucide-react';

export const getLiveLessonStyles = (event: LiveLessonEvent) => {
  if (!event.isRegistered) {
    return '';
  }

  return 'bg-emerald-100 text-emerald-700 border-emerald-200';
};

const CalendarDayCellEvent = ({ event }: { event: CalendarEvent }) => {
  if (event.type === 'practice-session') {
    return (
      <div
        key={event.id}
        className="text-[10px] px-1.5 py-0.5 rounded border truncate font-medium bg-violet-100 text-violet-700 border-violet-200"
      >
        <span className="opacity-75 mr-1">
          {new Intl.DateTimeFormat('pl-PL', {
            hour: '2-digit',
            minute: '2-digit',
          }).format(new Date(event.date))}
        </span>
        {event.title}
      </div>
    );
  }

  return (
    <div
      key={event.id}
      className={cn(
        'flex gap-2 items-center text-[10px] px-1.5 py-0.5 rounded border font-medium ',
        getLiveLessonStyles(event)
      )}
    >
      <span className="opacity-75">
        {new Intl.DateTimeFormat('pl-PL', {
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date(event.date))}
      </span>
      <span className="truncate">{event.title}</span>
      {event.isPaymentPending && <CircleAlert className="size-3.5 ml-auto" />}
      <Video className="shrink-0 size-3.5 ml-auto" />
    </div>
  );
};

export default CalendarDayCellEvent;
