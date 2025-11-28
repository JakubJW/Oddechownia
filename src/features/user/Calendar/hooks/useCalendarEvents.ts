import { useQuery } from '@tanstack/react-query';
import { startOfMonth, endOfMonth, subDays, addDays } from 'date-fns';
import { CalendarEvent } from '@/server/services/calendar.service';

export const useCalendarEvents = (currentDate: Date) => {
  // Calculate the view range (Current Month +/- buffer)
  // Adding a buffer ensures events visible in the "gray" days of previous/next month grid are loaded
  const start = subDays(startOfMonth(currentDate), 7);
  const end = addDays(endOfMonth(currentDate), 7);

  return useQuery({
    // Unique key includes the month range to trigger refetch on navigation
    queryKey: ['calendar-events', start.toISOString(), end.toISOString()],
    staleTime: 1000 * 60 * 10,
    queryFn: async () => {
      const params = new URLSearchParams({
        start: start.toISOString(),
        end: end.toISOString(),
      });

      const res = await fetch(`/api/calendar/events?${params}`);
      if (!res.ok) throw new Error('Failed to fetch events');

      const data = (await res.json()) as any[]; // Raw JSON

      // Transform JSON strings back to Date objects
      return data.map((event) => ({
        ...event,
      })) as CalendarEvent[];
    },
  });
};
