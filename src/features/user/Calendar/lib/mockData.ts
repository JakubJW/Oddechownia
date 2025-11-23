import { CalendarEventType } from '@/server/services/calendar.service';

export const getItemStyles = (type: CalendarEventType) => {
  switch (type) {
    case 'live-lesson':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'practice-session':
      return 'bg-violet-100 text-violet-700 border-violet-200';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};
