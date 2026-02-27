'use client';

import { Button } from '@/components/ui/button';
import { isSameDay } from 'date-fns';
import { Play } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { usePracticeSchedule } from './hooks/use-practice-schedule';
import { usePracticeScheduleList } from './hooks/use-practice-schedule-list';

export const PracticeSchedule = () => {
  const router = useRouter();
  const { selectedDate, days } = usePracticeScheduleList();
  const { data: allEvents = [] } = usePracticeSchedule(selectedDate);

  const getEventsForDay = (day: Date) => {
    return allEvents.filter((event) => isSameDay(event.scheduledAt, day));
  };

  return (
    <div className="col-span-12 md:col-span-8">
      <p className="font-light mb-4">Praktyka na dzisiaj</p>
      <div className="flex flex-col gap-y-6">
        {/* {days.map((day, idx) => ( */}
        <div
          // key={idx}
          className="flex gap-8"
        >
          {/* <div
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
            </div> */}
          <div className="h-full flex flex-grow border rounded-xl overflow-hidden">
            {getEventsForDay(new Date()).map((event) => (
              <div
                key={event.id}
                className="sm:flex flex-grow sm:pr-4"
              >
                <div className="relative aspect-video sm:h-[150px]">
                  <Image
                    src={event.lesson.thumbnailUrl}
                    className="object-cover"
                    fill
                    alt=""
                  />
                </div>
                <div className="p-4 pr-0">
                  <p>{event.lesson.title}</p>
                </div>
                <Button
                  className="ml-4 mb-4 sm:mb-0 sm:ml-auto self-center"
                  onClick={() => router.push(event.lesson.url)}
                >
                  Oglądaj <Play className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
        {/* ))} */}
      </div>
    </div>
  );
};
