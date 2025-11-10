'use client';

import { useInfiniteQuery, keepPreviousData } from '@tanstack/react-query';
import React from 'react';
import { FetchAdminLiveLessonsListResponse } from '@/server/models/liveLesson.models';
import { Video } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import UpdateDialog from './UpdateDialog';

const fetchComments = async ({ pageParam }: { pageParam: string | null }) => {
  const res = await fetch(`/api/live-lessons/?cursor=${pageParam}`, {
    method: 'GET',
  });

  if (!res.ok) {
    const errorBody = await res
      .json()
      .catch(() => ({ message: res.statusText }));

    throw new Error(
      `Failed to fetch comments (Status ${res.status}): ${
        errorBody.message || 'Unknown error'
      }`
    );
  }

  const json = await res.json();
  return json.data as FetchAdminLiveLessonsListResponse;
};

const LiveLessonsGrid = () => {
  const { data, isError, fetchNextPage, hasNextPage, isFetching, isPending } =
    useInfiniteQuery({
      queryKey: ['live-lessons'],
      initialPageParam: null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      placeholderData: keepPreviousData,
      queryFn: fetchComments,
    });

  if (isPending) {
    return <p>Ładowanie</p>;
  }

  if (isError) {
    return (
      <div className="p-4 text-center">
        <p>Podczas ładowania komentarzy wystąpił błąd.</p>
      </div>
    );
  }

  if (!data.pages[0]) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">
          Pod tą lekcją nie ma jeszcze żadnych komentarzy.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-2'>
      {data.pages.map((page, index) => (
        <React.Fragment key={index}>
          {page.data.map((liveLesson) => (
            <Card
              key={liveLesson.id}
              className="border-l-4 border-l-steelBlue"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  {liveLesson.title}
                  {liveLesson.isCompleted && (
                    <Badge variant="secondary">Zakończone</Badge>
                  )}
                  {liveLesson.isPublished && (
                    <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
                      Opublikowane nagranie
                    </Badge>
                  )}
                  {!liveLesson.isListed && liveLesson.isCompleted && (
                    <Badge variant="outline">Zapisy zamknięte</Badge>
                  )}
                  <UpdateDialog liveLesson={liveLesson} />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                  <span>
                    📅{' '}
                    {new Date(liveLesson.scheduledAt).toLocaleDateString(
                      'pl-PL'
                    )}
                  </span>
                  <span>
                    🕐{' '}
                    {new Date(liveLesson.scheduledAt).toLocaleTimeString(
                      'pl-PL'
                    )}
                  </span>
                  <span>⏱️ {liveLesson.duration} min</span>
                  <span>👥 {liveLesson.currentParticipants} zapisanych</span>
                </div>
                {liveLesson.description && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {liveLesson.description}
                  </p>
                )}
                {liveLesson.meetingLink && (
                  <a
                    href={liveLesson.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 text-sm text-primary hover:underline inline-block"
                  >
                    🔗 Link do spotkania
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default LiveLessonsGrid;
