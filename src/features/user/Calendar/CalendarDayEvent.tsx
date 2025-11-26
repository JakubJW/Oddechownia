import {
  CalendarEvent,
  LiveLessonEvent,
  PracticeSessionEvent,
} from '@/server/services/calendar.service';
import { CalendarEventType } from '@/server/services/calendar.service';
import { formatDuration, formatTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Clock,
  ClockFading,
  Loader2,
  Pencil,
  Play,
  Trash2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCalendarContext } from './context/CalendarContext';
import { useState } from 'react';
import { format } from 'date-fns';
import {
  useDeletePractice,
  useUpdatePractice,
} from './hooks/useScheduleMutations';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';

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
    if (event.status === 'completed') {
      return <Badge>Zakończone</Badge>;
    } else {
      return <Badge onClick={() => onSignUp(event)}>Zapisz się</Badge>;
    }
  }
};

const LiveLessonDayEvent = ({ event }: { event: LiveLessonEvent }) => {
  return (
    <>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full  bg-emerald-400" />
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
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [dateVal, setDateVal] = useState(
    format(new Date(event.date), 'yyyy-MM-dd')
  );
  const [timeVal, setTimeVal] = useState(formatTime(event.date));

  const deleteMutation = useDeletePractice();
  const updateMutation = useUpdatePractice({
    onSuccess: () => setIsEditing(false),
  });

  const handleSave = () => {
    updateMutation.mutate({
      id: event.id,
      date: new Date(`${dateVal}T${timeVal}`).toISOString(),
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setDateVal(format(new Date(event.date), 'yyyy-MM-dd'));
    setTimeVal(format(new Date(event.date), 'HH:mm'));
  };

  return (
    <div className="flex flex-col gap-2 rounded-md hover:bg-muted/10 transition-colors group">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-violet-400 shrink-0" />
            <p className="text-sm font-medium  truncate">{event.title}</p>
          </div>
          <span className="text-xs text-muted-foreground">
            {getItemContent(event.type)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="size-7 text-muted-foreground hover:bg-muted rounded-full"
            onClick={() => router.push(event.lessonUrl)}
          >
            <Play className="size-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                className="size-7 rounded-full text-destructive hover:bg-destructive/20"
              >
                <Trash2 className="size-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Usunąć praktykę?</AlertDialogTitle>
                <AlertDialogDescription>
                  To usunie &quot;{event.title}&quot; z Twojego kalendarza. Tej
                  operacji nie można cofnąć.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Anuluj</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteMutation.mutate(event.id)}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  {updateMutation.isPending && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  )}
                  Usuń
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="date"
              value={dateVal}
              onChange={(e) => setDateVal(e.target.value)}
              className="h-8 text-xs px-2"
            />
            <Input
              type="time"
              value={timeVal}
              onChange={(e) => setTimeVal(e.target.value)}
              className="h-8 text-xs px-2"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs"
              onClick={handleCancel}
            >
              Anuluj
            </Button>
            <Button
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={handleSave}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              )}
              Zapisz
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-xs text-muted-foreground flex gap-2 items-center">
          <div className="flex items-center gap-1">
            <Clock className="size-3" />
            <span>{formatTime(event.date)}</span>
          </div>
          <div className="flex items-center gap-1">
            <ClockFading className="size-3" />
            <span>{formatDuration(event.duration)}</span>
          </div>
          <button
            className="flex underline gap-1 items-center text-muted-foreground hover:bg-muted rounded-full"
            onClick={() => setIsEditing(true)}
          >
            Edytuj <Pencil className="size-3"></Pencil>
          </button>
        </div>
      )}
    </div>
  );
};

const CalendarDayEvent = ({ event }: { event: CalendarEvent }) => {
  return (
    <div className="pt-4">
      {event.type === 'live-lesson' ? (
        <LiveLessonDayEvent event={event} />
      ) : (
        <ScheduledPracticeDayEvent event={event} />
      )}
    </div>
  );
};

export default CalendarDayEvent;
