import { UserPracticeScheduleEvent } from '@/entities/models/user-practice-schedule';
import { useQuery } from '@tanstack/react-query';
import { addWeeks } from 'date-fns';

export const usePracticeSchedule = (currentDate: Date) => {
  const start = currentDate;
  const end = addWeeks(currentDate, 1);

  return useQuery({
    queryKey: ['practice-schedule', start.toISOString(), end.toISOString()],
    queryFn: async () => {
      const params = new URLSearchParams({
        start: start.toISOString(),
        end: end.toISOString(),
      });

      const res = await fetch(`/api/practice-schedule?${params}`);
      if (!res.ok) throw new Error('Failed to fetch events');

      const data = await res.json();

      return data as UserPracticeScheduleEvent[];
    },
  });
};
