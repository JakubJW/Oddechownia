'use client';

import { Button } from '@/components/ui/button';
import { format, isSameDay, isSameMonth } from 'date-fns';
import { pl } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCalendarGrid } from './hooks/useCalendarGrid';
import { CalendarDayCell } from './CalendarDayCell';
import { useCalendarEvents } from './hooks/useCalendarEvents';
import { CalendarProvider } from './context/CalendarContext';
import { useCallback, useMemo, useState } from 'react';
import { LiveLessonEvent } from '@/entities/models/user-practice-schedule';
import { getRequiredUser } from '@/lib/data';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const WEEKDAYS = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz'];

const CaledarGrid = ({ className }: { className?: string }) => {
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

  const getEventsForDay = (day: Date) => {
    return allEvents.filter((event) => isSameDay(event.date, day));
  };

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
      <div className={cn('', className)}>
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <p className="font-semibold flex-grow">
              {format(selectedMonth, 'LLLL yyyy', { locale: pl })}
            </p>
            <Button
              variant="default"
              onClick={() => goToToday()}
            >
              Skocz do dzisiaj
            </Button>
            <Button
              variant="default"
              size="icon"
              onClick={() => prevMonth()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="default"
              size="icon"
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
              {weeks.map((week, weekIdx) => (
                <div
                  key={weekIdx}
                  className="grid grid-cols-7 border-b last:border-b-0"
                >
                  {week.map((day) => (
                    <CalendarDayCell
                      key={day.toISOString()}
                      day={day}
                      isSelected={isSameDay(day, selectedDate)}
                      isSameMonth={isSameMonth(day, selectedMonth)}
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
        </div>
      </div>
    </CalendarProvider>
  );
};

export default CaledarGrid;
