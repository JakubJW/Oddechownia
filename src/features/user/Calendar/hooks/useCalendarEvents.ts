import { useQuery } from '@tanstack/react-query';
import { startOfMonth, endOfMonth } from 'date-fns';
import { CalendarEvent } from '@/entities/models/user-practice-schedule';

export const useCalendarEvents = (currentDate: Date) => {
  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);

  return useQuery({
    queryKey: ['calendar-events', start.toISOString(), end.toISOString()],
    staleTime: 1000 * 60 * 10,
    queryFn: async () => {
      const params = new URLSearchParams({
        start: start.toISOString(),
        end: end.toISOString(),
      });

      const res = await fetch(`/api/calendar/events?${params}`);
      if (!res.ok) throw new Error('Failed to fetch events');

      const data = (await res.json()) as any[];

      return data.map((event) => ({
        ...event,
      })) as CalendarEvent[];
    },
  });
};
