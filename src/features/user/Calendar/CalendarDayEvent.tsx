import {
  CalendarEvent,
  LiveLessonEvent,
  PracticeSessionEvent,
} from '@/server/services/calendar.service';
import { CalendarEventType } from '@/server/services/calendar.service';
import { formatDuration, formatTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCalendarContext } from './context/CalendarContext';

const getItemContent = (type: CalendarEventType) => {
  if (type === 'live-lesson') {
    return 'Zajęcia na żywo';
  }

  return 'Zaplanowana praktyka';
};

const ActionButton = ({ event }: { event: LiveLessonEvent }) => {
  const { onSignUp } = useCalendarContext();

  if (event.isRegistered && !event.isPaymentPending) {
    if (!event.recordingUrl) {
      return <Badge>Przygotowywanie nagrania</Badge>;
    } else {
      return <Badge>Dostępne nagranie</Badge>;
    }
  } else if (event.isRegistered && event.isPaymentPending) {
    return <Badge>Dokończ płatność</Badge>;
  } else {
    return <Badge onClick={() => onSignUp(event)}>Zapisz się</Badge>;
  }
};

const LiveLessonDayEvent = ({ event }: { event: LiveLessonEvent }) => {
  return (
    <>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-400" />
        <span className="text-sm font-medium text-foreground">
          {event.title}
        </span>
      </div>
      <div className="flex flex-col items-start gap-2 text-xs text-muted-foreground">
        <span>{getItemContent(event.type)}</span>
        <div className="space-x-2">
          <span>🕒 {formatTime(event.date)}</span>
          {event.duration && <span>⏳ {event.duration} min</span>}
        </div>
      </div>
      <ActionButton event={event} />
    </>
  );
};

const ScheduledPracticeDayEvent = ({
  event,
}: {
  event: PracticeSessionEvent;
}) => {
  return (
    <>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-violet-400" />
        <span className="text-sm font-medium text-foreground">
          {event.title}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex flex-col items-start gap-2 text-xs text-muted-foreground">
          <span>{getItemContent(event.type)}</span>
          <div className="space-x-2">
            <span>🕒 {formatTime(event.date)}</span>
            <span>🎬 {formatDuration(event.duration)}</span>
          </div>
        </div>
        <Button
          size="icon"
          className="h-8 w-8 rounded-full"
        >
          <Play />
        </Button>
      </div>
    </>
  );
};

const CalendarDayEvent = ({ event }: { event: CalendarEvent }) => {
  return (
    <div className="flex flex-col gap-2 px-2 py-3 rounded-md">
      {event.type === 'live-lesson' ? (
        <LiveLessonDayEvent event={event} />
      ) : (
        <ScheduledPracticeDayEvent event={event} />
      )}
    </div>
  );
};

export default CalendarDayEvent;
