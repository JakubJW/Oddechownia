'use client';

import { isSameDay, format } from 'date-fns';
import { usePracticeSchedule } from './hooks/use-practice-schedule';
import { usePracticeScheduleList } from './hooks/use-practice-schedule-list';
import { pl } from 'date-fns/locale';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export const PracticeSchedule = () => {
  const { selectedDate, days } = usePracticeScheduleList();
  const { data: allEvents = [] } = usePracticeSchedule(selectedDate);

  const getEventsForDay = (day: Date) => {
    return allEvents.filter((event) => isSameDay(event.scheduledAt, day));
  };

  return (
    <div className="col-span-12 md:col-span-8">
      <div className="flex flex-col gap-y-6">
        {days.map((day, idx) => (
          <div
            key={idx}
            className="flex gap-8 h-[150px]"
          >
            <div
              className={cn(
                'h-full flex flex-col border rounded-xl overflow-hidden aspect-square',
                isSameDay(new Date(), day) && 'border-matcha'
              )}
            >
              <div
                className={cn(
                  'border-b text-center text-lg py-2',
                  isSameDay(new Date(), day)
                    ? 'bg-matcha-foreground border-matcha-foreground'
                    : 'bg-muted'
                )}
              >
                {format(day, 'MMM', { locale: pl })}
              </div>
              <div className="my-auto text-center">
                <div className="text-4xl italic">
                  {format(day, 'dd', { locale: pl })}
                </div>
                <div className="text-md font-light">
                  {format(day, 'EEEEEE', { locale: pl })}
                </div>
              </div>
            </div>
            <div className="h-full flex flex-grow border rounded-xl overflow-hidden">
              {getEventsForDay(day).map((event) => (
                <div
                  key={event.id}
                  className="flex"
                >
                  <div className="h-full relative aspect-video">
                    <Image
                      src={event.lesson.thumbnailUrl}
                      className="object-cover"
                      fill
                      alt=""
                    />
                  </div>
                  <div className="p-4">
                    <p>{event.lesson.title}</p>
                  </div>
                  <button className="h-full">siema</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
