import { CalendarEvent } from '@/server/services/calendar.service';
import { CalendarEventType } from '@/server/services/calendar.service';
import { cn } from '@/lib/utils';

export const getItemStyles = (event: CalendarEvent) => {
  switch (event.type) {
    case 'live-lesson':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'practice-session':
      return 'bg-violet-100 text-violet-700 border-violet-200';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const CalendarDayCellEvent = ({ event }: { event: CalendarEvent }) => {
  return (
    <div
      key={event.id}
      className={cn(
        'text-[10px] px-1.5 py-0.5 rounded border truncate font-medium ',
        getItemStyles(event)
      )}
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
};

export default CalendarDayCellEvent;
