import { useState, useMemo } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
} from 'date-fns';
import { pl } from 'date-fns/locale';

export const useCalendarGrid = (initialDate = new Date()) => {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [selectedWeek, setSelectedWeek] = useState<Date>(initialDate);

  // 1. Navigation Handlers
  const nextMonth = () => setSelectedWeek((prev) => addWeeks(prev, 1));
  const prevMonth = () => setSelectedWeek((prev) => subWeeks(prev, 1));
  const goToToday = () => {
    setSelectedWeek(new Date());
    setSelectedDate(new Date());
  };

  // 2. Grid Calculation
  const week = useMemo(() => {
    const start = startOfWeek(selectedWeek, { locale: pl });
    const end = endOfWeek(selectedWeek, { locale: pl });

    const days = eachDayOfInterval({ start, end });

    return Array.from({ length: Math.ceil(days.length / 7) }, (_, i) =>
      days.slice(i * 7, i * 7 + 7)
    );
  }, [selectedWeek]);

  return {
    setSelectedDate,
    selectedDate,
    week,
    selectedWeek,
    nextMonth, // <--- Exposed function
    prevMonth, // <--- Exposed function
    goToToday, // <--- Exposed function
  };
};
