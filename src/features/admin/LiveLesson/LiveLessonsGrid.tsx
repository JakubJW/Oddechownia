'use client';

import { queryClient } from '@/components/QueryClientProvider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AdminLiveLessonRecordDTO,
  FetchAdminLiveLessonsListResponse,
  UpdateLiveLessonResponse,
} from '@/server/models/liveLesson.models';
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
} from '@tanstack/react-query';
import { Edit, Video } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import z from 'zod';
import { updateFormSchema } from './Form/schema';
import UpdateDialog from './UpdateDialog';

const fetchLiveLessons = async ({
  pageParam,
}: {
  pageParam: string | null;
}) => {
  const res = await fetch(`/api/live-lessons/?cursor=${pageParam}`, {
    method: 'GET',
  });

  if (!res.ok) {
    const errorBody = await res
      .json()
      .catch(() => ({ message: res.statusText }));

    throw new Error(errorBody.message || 'Unknown error');
  }

  const json = await res.json();
  return json.data as FetchAdminLiveLessonsListResponse;
};

const update = async ({
  id,
  values,
}: {
  id: string;
  values: z.infer<typeof updateFormSchema>;
}) => {
  const res = await fetch(`/api/live-lessons/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    const errorBody = await res
      .json()
      .catch(() => ({ message: res.statusText }));

    throw new Error(errorBody.message || 'Unknown error');
  }

  const json = await res.json();
  return json.data as UpdateLiveLessonResponse;
};

const LiveLessonsGrid = () => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<
    AdminLiveLessonRecordDTO | undefined
  >(undefined);

  const { data, isError, isPending, hasNextPage, fetchNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: ['live-lessons'],
      initialPageParam: null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      placeholderData: keepPreviousData,
      queryFn: fetchLiveLessons,
    });

  const mutation = useMutation<
    UpdateLiveLessonResponse,
    Error,
    { id: string; values: z.infer<typeof updateFormSchema> }
  >({
    mutationFn: update,
    onSuccess: () => {
      setEditDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['live-lessons'] });
    },
    onError: (error) => toast.error(error.message),
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
    <div className="space-y-2">
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
                  <Button
                    type="button"
                    className="rounded-full"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setCurrentLesson(liveLesson);
                      setEditDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
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
      {currentLesson && (
        <UpdateDialog
          mutation={mutation}
          liveLesson={currentLesson}
          open={editDialogOpen}
          setOpen={setEditDialogOpen}
        />
      )}
      {hasNextPage && (
        <Button
          disabled={isFetching}
          onClick={() => fetchNextPage()}
        >
          {isFetching ? 'Ładowanie...' : 'Pokaż więcej'}
        </Button>
      )}{' '}
    </div>
  );
};

export default LiveLessonsGrid;
