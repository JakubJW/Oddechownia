'use client';

import { useInfiniteQuery, keepPreviousData } from '@tanstack/react-query';
import { FetchUserLiveLessonsResponse } from '@/server/models/liveLesson.models';
import { UserLiveLessonCard } from './user-live-lesson-card';
import React from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const fetchLiveLessons = async ({
  pageParam,
}: {
  pageParam: string | null;
}) => {
  const res = await fetch(`/api/user-live-lessons?cursor=${pageParam}`, {
    method: 'GET',
  });

  if (!res.ok) {
    const errorBody = (await res.json()) as { message: string };

    throw new Error(errorBody.message || 'Unknown error');
  }

  const json = await res.json();
  return json.data as FetchUserLiveLessonsResponse;
};

export const Grid = () => {
  const router = useRouter();
  const { data, isError, isPending, error } = useInfiniteQuery({
    queryKey: ['live-lessons'],
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    placeholderData: keepPreviousData,
    queryFn: fetchLiveLessons,
  });

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
              id={lesson.id}
              description={lesson.description}
              status={lesson.status}
              thumbnail={lesson.thumbnail}
              key={lesson.id}
              title={lesson.title}
              meetingUrl={lesson.meetingUrl}
              recordingUrl={lesson.recordingUrl}
              scheduledAt={lesson.scheduledAt}
              duration={lesson.duration}
            />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};
