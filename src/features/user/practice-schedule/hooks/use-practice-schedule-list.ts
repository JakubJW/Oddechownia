import { useState, useMemo } from 'react';
import { eachDayOfInterval, subWeeks, addWeeks } from 'date-fns';

export const usePracticeScheduleList = (initialDate = new Date()) => {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);

  const nextWeek = () => setSelectedDate((prev) => addWeeks(prev, 1));
  const prevWeek = () => setSelectedDate((prev) => subWeeks(prev, 1));
  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const days = useMemo(() => {
    const start = selectedDate;
    const end = addWeeks(selectedDate, 1);

    const days = eachDayOfInterval({ start, end });

    return days;
  }, [selectedDate]);

  return {
    days,
    selectedDate,
    nextWeek,
    prevWeek,
    goToToday,
  };
};
