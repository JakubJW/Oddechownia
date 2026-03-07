'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { UserLiveLessonCard } from './user-live-lesson-card';
import { useUserLiveLessons } from './hooks/use-user-live-lessons';

export const Grid = () => {
  const router = useRouter();
  const { isPending, isError, error, data } = useUserLiveLessons();

  if (isPending) {
    return (
      <div className="flex flex-col justify-center items-center  h-full space-y-4 text-center">
        <span className="flex gap-2 text-gray-500">
          Ładowanie <Loader2 className="animate-spin" />
        </span>
      </div>
    );
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  if (data.pages.every((page) => !page.data.length)) {
    return (
      <div className="flex flex-col justify-center items-center  space-y-4 text-center">
        <p className="text-gray-500">
          Nie jesteś zapisany na żadne zajęcia na żywo.
        </p>
        <Button onClick={() => router.push('/zajecia-na-zywo')}>
          Zobacz nadchodzące zajęcia <ArrowRight className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-8">
      {data.pages.map((page, index) => (
        <React.Fragment key={index}>
          {page.data.map((lesson) => (
            <UserLiveLessonCard
              key={lesson.id}
              title={lesson.title}
              description={lesson.description}
              image={lesson.image}
              scheduledAt={lesson.scheduledAt}
              duration={lesson.duration}
              status={lesson.status}
              meetingLink={lesson.meetingLink}
              recordingUrl={lesson.recordingUrl}
            />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};
