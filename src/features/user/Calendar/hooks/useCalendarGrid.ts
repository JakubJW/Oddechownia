import { useState, useMemo } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
} from 'date-fns';
import { pl } from 'date-fns/locale';

export const useCalendarGrid = (initialDate = new Date()) => {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);

  // 1. Navigation Handlers
  const nextMonth = () => setSelectedDate((prev) => addMonths(prev, 1));
  const prevMonth = () => setSelectedDate((prev) => subMonths(prev, 1));
  const goToToday = () => setSelectedDate(new Date());

  // 2. Grid Calculation
  const weeks = useMemo(() => {
    const start = startOfWeek(startOfMonth(selectedDate), { locale: pl });
    const end = endOfWeek(endOfMonth(selectedDate), { locale: pl });

    const days = eachDayOfInterval({ start, end });

    return Array.from({ length: Math.ceil(days.length / 7) }, (_, i) =>
      days.slice(i * 7, i * 7 + 7)
    );
  }, [selectedDate]);

  return {
    setSelectedDate,
    selectedDate,
    weeks,
    nextMonth, // <--- Exposed function
    prevMonth, // <--- Exposed function
    goToToday, // <--- Exposed function
  };
};
