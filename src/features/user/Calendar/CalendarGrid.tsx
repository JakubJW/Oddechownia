'use client';

import { Button } from '@/components/ui/button';
import {
  CalendarEvent,
  LiveLessonEvent,
} from '@/entities/models/user-practice-schedule';
import { format, isSameDay, isSameMonth } from 'date-fns';
import { pl } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { CalendarDayCell } from './CalendarDayCell';
import { CalendarProvider } from './context/CalendarContext';
import { useCalendarEvents } from './hooks/useCalendarEvents';
import { useCalendarGrid } from './hooks/useCalendarGrid';
import Brandmark from '@/assets/Brandmark.svg';

const WEEKDAYS = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz'] as const;
const EMPTY_ARRAY: unknown[] = [];

const CaledarGrid = () => {
  const {
    weeks,
    selectedDate,
    selectedMonth,
    setSelectedDate,
    nextMonth,
    prevMonth,
    goToToday,
  } = useCalendarGrid();
  const { data: allEvents = [], isFetching } = useCalendarEvents(selectedMonth);

  const eventsByDate = useMemo(() => {
    const groups: Record<string, CalendarEvent[]> = {};

    allEvents.forEach((event) => {
      const key = format(event.date, 'yyyy-MM-dd');

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(event);
    });

    return groups;
  }, [allEvents]);

  const handleDaySelect = useCallback(
    (date: Date) => {
      setSelectedDate(date);
    },
    [setSelectedDate]
  );

  const handleSignUp = useCallback((lesson: LiveLessonEvent) => {
    // setSelectedLesson(lesson);
    // setIsSignUpOpen(true);
  }, []);

  const contextValue = useMemo(
    () => ({
      onSignUp: handleSignUp,
    }),
    [handleSignUp]
  );

  return (
    <CalendarProvider value={contextValue}>
      <div className="flex items-center gap-2">
        <p className="font-semibold grow">
          {format(selectedMonth, 'LLLL yyyy', { locale: pl })}
        </p>
        <Button
          variant="default"
          onClick={goToToday}
        >
          Skocz do dzisiaj
        </Button>
        <Button
          variant="default"
          size="icon"
          onClick={prevMonth}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <Button
          variant="default"
          size="icon"
          onClick={nextMonth}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
      <div className="mt-4 border rounded-xl">
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
        <div className="relative">
          {weeks.map((week, weekIdx) => (
            <div
              key={weekIdx}
              className="grid grid-cols-7 border-b last:border-b-0"
            >
              {week.map((day) => {
                const key = format(day, 'yyy-MM-dd');
                const events = eventsByDate[key] || EMPTY_ARRAY;

                return (
                  <CalendarDayCell
                    key={key}
                    day={day}
                    isSelected={isSameDay(day, selectedDate)}
                    isSameMonth={isSameMonth(day, selectedMonth)}
                    onSelect={handleDaySelect}
                    events={events}
                  />
                );
              })}
            </div>
          ))}
          {isFetching && (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-muted/60">
              <div className="flex flex-col gap-2 justify-center items-center">
                <Brandmark className="animate-pulse size-16 bg-matcha rounded-full p-4" />
                <span className="text-sm text-muted-foreground">
                  Ładowanie...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </CalendarProvider>
  );
};

export default CaledarGrid;
