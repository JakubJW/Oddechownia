import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format, isSameDay, isSameMonth } from 'date-fns';
import { cn } from '@/lib/utils';
import { pl } from 'date-fns/locale';
import { CalendarEvent } from '@/server/services/calendar.service';
import CalendarDayCellEvent from './CalendarDayCellEvent';
import CalendarDayEvent from './CalendarDayEvent';
import { DayDetailsModal } from './DayDetailsModal';

interface CalendarDayCellProps {
  day: Date;
  currentMonth: Date;
  isSelected: boolean;
  onSelect: (date: Date) => void;
  events: CalendarEvent[];
}

export const CalendarDayCell = ({
  day,
  currentMonth,
  isSelected,
  onSelect,
  events,
}: CalendarDayCellProps) => {
  const isToday = isSameDay(day, new Date());
  const isCurrentMonth = isSameMonth(day, currentMonth);
  const MAX_INLINE = 2;
  const hiddenCount = Math.max(0, events.length - MAX_INLINE);

  return (
    <DayDetailsModal
      day={day}
      eventCount={events.length}
      content={
        events.length ? (
          events.map((event) => (
            <CalendarDayEvent
              key={event.id}
              event={event}
            />
          ))
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Brak zaplanowanych zajęć
          </div>
        )
      }
    >
      <div
        onClick={() => onSelect(day)}
        className={cn(
          'min-h-[120px] p-2 border-r last:border-r-0 cursor-pointer transition-colors flex flex-col gap-1',
          'hover:bg-muted/50',
          !isCurrentMonth && 'bg-muted/30 text-muted-foreground',
          isSelected && 'bg-primary/5'
        )}
      >
        <div className="flex justify-between items-start">
          <span
            className={cn(
              'text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full',
              isToday && 'bg-primary text-primary-foreground',
              !isCurrentMonth && !isToday && 'text-muted-foreground/50'
            )}
          >
            {format(day, 'd')}
          </span>
        </div>

        <div className="flex-1 flex flex-col gap-1 mt-1">
          {events.slice(0, MAX_INLINE).map((event) => (
            <CalendarDayCellEvent
              key={event.id}
              event={event}
            />
          ))}

          {hiddenCount > 0 && (
            <div className="text-[10px] text-muted-foreground font-medium pl-1 opacity-70 group-hover:opacity-100 transition-opacity">
              +{hiddenCount} więcej...
            </div>
          )}
        </div>
      </div>
    </DayDetailsModal>
  );
};
