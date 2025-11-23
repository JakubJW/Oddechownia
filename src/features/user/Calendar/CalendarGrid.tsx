'use client';

import { Button } from '@/components/ui/button';
import { format, isSameDay } from 'date-fns';
import { pl } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCalendarGrid } from './hooks/useCalendarGrid';
import { CalendarDayCell } from './CalendarDayCell';
import { useCalendarEvents } from './hooks/useCalendarEvents';

const WEEKDAYS = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz'];

const CaledarGrid = () => {
  const {
    weeks,
    selectedDate,
    setSelectedDate,
    nextMonth,
    prevMonth,
    goToToday,
  } = useCalendarGrid();

  const { data: allEvents = [], isLoading } = useCalendarEvents(selectedDate);

  const getEventsForDay = (day: Date) => {
    return allEvents.filter((event) => isSameDay(event.date, day));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => prevMonth()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold">
          {format(selectedDate, 'LLLL yyyy', { locale: pl })}
        </h3>
        <Button
          variant="ghost"
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

        <div className="flex flex-col">
          {weeks.map((week, weekIdx) => (
            <div
              key={weekIdx}
              className="grid grid-cols-7 border-b last:border-b-0"
            >
              {week.map((day) => (
                <CalendarDayCell
                  key={day.toISOString()}
                  day={day}
                  currentMonth={selectedDate}
                  isSelected={isSameDay(day, selectedDate)}
                  onSelect={setSelectedDate}
                  events={getEventsForDay(day)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CaledarGrid;
