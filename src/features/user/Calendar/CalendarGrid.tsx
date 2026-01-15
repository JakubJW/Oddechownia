'use client';

import { Button } from '@/components/ui/button';
import { format, isSameDay } from 'date-fns';
import { pl } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCalendarGrid } from './hooks/useCalendarGrid';
import { CalendarDayCell } from './CalendarDayCell';
import { useCalendarEvents } from './hooks/useCalendarEvents';
import SignUpDialog from '@/features/LiveLesson/SignUpDialog';
import { CalendarProvider } from './context/CalendarContext';
import { useCallback, useMemo, useState } from 'react';
import { LiveLessonEvent } from '@/server/services/calendar.service';
import { getRequiredUser } from '@/lib/data';
import Image from 'next/image';
import CalendarDayEvent from './CalendarDayEvent';
import { cn } from '@/lib/utils';

const WEEKDAYS = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz'];

const CaledarGrid = ({
  user,
  className,
}: {
  user: Awaited<ReturnType<typeof getRequiredUser>>;
  className?: string;
}) => {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<LiveLessonEvent | null>(
    null
  );
  const {
    week,
    selectedDate,
    selectedWeek,
    setSelectedDate,
    nextMonth,
    prevMonth,
    goToToday,
  } = useCalendarGrid();
  const { data: allEvents = [], isFetching } = useCalendarEvents(selectedWeek);

  const getEventsForDay = (day: Date) => {
    return allEvents.filter((event) => isSameDay(event.date, day));
  };

  const handleSignUp = useCallback((lesson: LiveLessonEvent) => {
    setSelectedLesson(lesson);
    setIsSignUpOpen(true);
  }, []);

  const contextValue = useMemo(
    () => ({
      onSignUp: handleSignUp,
    }),
    [handleSignUp]
  );

  return (
    <CalendarProvider value={contextValue}>
      <div className={cn('', className)}>
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-semibold flex-grow">
              {format(selectedWeek, 'LLLL yyyy', { locale: pl })}
            </h3>
            <Button
              size="sm"
              variant="default"
              onClick={() => goToToday()}
            >
              Skocz do dzisiaj
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => prevMonth()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => nextMonth()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="border rounded-lg overflow-hidden bg-card">
            <div className="grid grid-cols-7 border-b bg-muted/30">
              {WEEKDAYS.map((day) => (
                <div
                  key={day}
                  className="p-2 text-center text-sm font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="relative flex flex-col">
              {week.map((week, weekIdx) => (
                <div
                  key={weekIdx}
                  className="grid grid-cols-7 border-b last:border-b-0"
                >
                  {week.map((day) => (
                    <CalendarDayCell
                      key={day.toISOString()}
                      day={day}
                      isSelected={isSameDay(day, selectedDate)}
                      onSelect={setSelectedDate}
                      events={getEventsForDay(day)}
                    />
                  ))}
                </div>
              ))}
              {isFetching && (
                <div className="absolute flex items-center justify-center w-full h-full bg-muted/60">
                  <div className="flex flex-col gap-2 justify-center items-center">
                    <Image
                      unoptimized
                      className="relative animate-pulse z-10"
                      src="/brandmark.svg"
                      alt="Logo"
                      height={64}
                      width={64}
                    />
                    <span className="text-sm text-muted-foreground">
                      Ładowanie
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          {selectedLesson && (
            <SignUpDialog
              liveLesson={{
                id: selectedLesson.id,
                title: selectedLesson.title,
                description: selectedLesson.description,
                scheduledAt: selectedLesson.date,
                isEligibleForFree: selectedLesson.isEligibleForFree,
                freeEligibilitiesUsed: selectedLesson.freeEligibilitiesUsed,
              }}
              open={isSignUpOpen}
              setOpen={setIsSignUpOpen}
              user={user}
            />
          )}
        </div>
        <div className="hidden md:flex flex-col flex-grow mt-4">
          <div className="flex flex-col flex-grow  rounded-xl">
            {!getEventsForDay(selectedDate).length && (
              <div className="flex items-center justify-center flex-grow font-light text-sm ">
                Brak nadchodzących wydarzeń.
              </div>
            )}
            {getEventsForDay(selectedDate).map((event) => (
              <CalendarDayEvent
                key={event.id}
                event={event}
              />
            ))}
          </div>
        </div>
      </div>
    </CalendarProvider>
  );
};

export default CaledarGrid;
