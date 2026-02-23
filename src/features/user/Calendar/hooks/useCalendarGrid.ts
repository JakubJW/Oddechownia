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
  const [selectedMonth, setSelectedMonth] = useState<Date>(initialDate);

  const nextMonth = () => setSelectedMonth((prev) => addMonths(prev, 1));
  const prevMonth = () => setSelectedMonth((prev) => subMonths(prev, 1));
  const goToToday = () => {
    setSelectedMonth(new Date());
    setSelectedDate(new Date());
  };

  const weeks = useMemo(() => {
    const start = startOfWeek(startOfMonth(selectedMonth), { locale: pl });
    const end = endOfWeek(endOfMonth(selectedMonth), { locale: pl });

    const days = eachDayOfInterval({ start, end });

    const result = Array.from({ length: Math.ceil(days.length / 7) }, (_, i) =>
      days.slice(i * 7, i * 7 + 7)
    );
    return result;
  }, [selectedMonth]);

  return {
    setSelectedDate,
    selectedDate,
    weeks,
    selectedMonth,
    nextMonth,
    prevMonth,
    goToToday,
  };
};
