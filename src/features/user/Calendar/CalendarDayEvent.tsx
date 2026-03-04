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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CalendarEvent,
  CalendarEventType,
  LiveLessonEvent,
  PracticeSessionEvent,
} from '@/entities/models/user-practice-schedule';
import { useUserPracticeScheduleMutations } from '@/features/admin/user-practice-schedule/hooks/use-user-practice-schedule-mutations';
import { formatTime } from '@/lib/utils';
import { Clock, ClockFading, Loader2, Play, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCalendarContext } from './context/CalendarContext';
import { useCalendarGrid } from './hooks/useCalendarGrid';

const getItemContent = (type: CalendarEventType) => {
  if (type === 'live-lesson') {
    return 'Zajęcia na żywo';
  }

  return 'Zaplanowana praktyka';
};

const ActionButton = ({ event }: { event: LiveLessonEvent }) => {
  const { onSignUp } = useCalendarContext();

  if (event.isRegistered && !event.isPaymentPending) {
    switch (event.status) {
      case 'upcoming':
        return <Badge className="shrink-0">Nadchodzące</Badge>;
      case 'live':
        return (
          <a
            href={event.meetingLink!}
            target="_blank"
          >
            <Badge className="shrink-0">Dołącz</Badge>
          </a>
        );
      case 'completed': {
        switch (event.recordingStatus) {
          case 'available':
            return (
              <a
                href={event.recordingUrl!}
                target="_blank"
              >
                <Badge className="shrink-0">Obejrzyj nagranie</Badge>
              </a>
            );
          case 'preparing':
            return <Badge className="shrink-0">Przygotowywanie nagrania</Badge>;
        }
      }
    }
  } else if (event.isRegistered && event.isPaymentPending) {
    return <Badge onClick={() => onSignUp(event)}>Dokończ płatność</Badge>;
  } else {
    switch (event.status) {
      case 'upcoming':
        return (
          <Badge
            className="shrink-0"
            onClick={() => onSignUp(event)}
          >
            Zapisz się
          </Badge>
        );
      case 'live':
        return <Badge className="shrink-0">Trwa</Badge>;
      case 'completed': {
        return (
          <Badge className="shrink-0 bg-muted text-muted-foreground">
            Zakończone
          </Badge>
        );
      }
    }
  }
};

const LiveLessonDayEvent = ({ event }: { event: LiveLessonEvent }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-start gap-2">
        <div>
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-emerald-400 shrink-0" />
            <p className="text-sm font-medium truncate">{event.title}</p>
          </div>
          <span className="text-xs text-muted-foreground">
            {getItemContent(event.type)}
          </span>
        </div>
        <ActionButton event={event} />
      </div>
      <div className="text-xs text-muted-foreground flex gap-2 items-center">
        <div className="flex items-center gap-1">
          <Clock className="size-3" />
          <span>{formatTime(event.date)}</span>
        </div>
        <div className="flex items-center gap-1">
          <ClockFading className="size-3" />
          <span>{event.duration} min</span>
        </div>
      </div>
    </div>
  );
};

const ScheduledPracticeActions = ({
  event,
}: {
  event: PracticeSessionEvent;
}) => {
  const router = useRouter();
  const { deleteMutation } = useUserPracticeScheduleMutations();
  const { refreshCalendar } = useCalendarGrid();

  return (
    <div className="flex gap-2">
      <Button
        size="icon"
        variant="secondary"
        className="size-7 text-muted-foreground hover:text-violet-700 hover:bg-violet-100 rounded-full transition-colors duration-300"
        onClick={() => router.push(event.lessonUrl)}
      >
        <Play className="size-4" />
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            size="icon"
            variant="secondary"
            className="size-7 rounded-full text-destructive hover:bg-destructive/20 transition-colors duration-300"
          >
            <Trash2 className="size-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Jesteś pewien?</AlertDialogTitle>
            <AlertDialogDescription>
              Zamierzasz usunąć <b>&quot;{event.title}&quot;</b> z planu
              praktyk. Tej operacji nie można cofnąć.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteMutation.isPending}
              onClick={() =>
                deleteMutation.mutate(event.id, {
                  onSuccess: () => refreshCalendar(),
                })
              }
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteMutation.isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}
              Usuń
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const ScheduledPracticeDayEvent = ({
  event,
}: {
  event: PracticeSessionEvent;
}) => {
  return (
    <div className="flex flex-col gap-2 rounded-md hover:bg-muted/10">
      <div className="flex justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-violet-400 shrink-0" />
            <p className="text-sm font-medium text-wrap">{event.title}</p>
          </div>
          <span className="text-xs text-muted-foreground">
            {getItemContent(event.type)}
          </span>
        </div>
        <ScheduledPracticeActions event={event} />
      </div>
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
