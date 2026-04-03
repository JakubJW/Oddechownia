'use client';

import { Button } from '@/components/ui/button';
import { AdminLiveLessonCardDTO } from '@/entities/models/live-lesson';
import React, { useState } from 'react';
import ParticipantsDialog from './ParticipantsDialog';
import UpdateDialog from './UpdateDialog';
import { AdminLiveLessonCard } from './admin-live-lesson-card';
import { useLiveLessons } from './hooks/useLiveLessons';

export const AdminLiveLessonsGrid = () => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [participantsDialogOpen, setParticipantsDialogOpen] = useState(false);
  const [currentParticipantsLessonId, setCurrentParticipantsLessonId] =
    useState<string | undefined>(undefined);
  const [currentLesson, setCurrentLesson] = useState<
    AdminLiveLessonCardDTO | undefined
  >(undefined);

  const { isPending, isError, data, isFetching, hasNextPage, fetchNextPage } =
    useLiveLessons();

  if (isPending) {
    return <p>Ładowanie...</p>;
  }

  if (isError) {
    return (
      <div className="p-4 text-center">
        <p>Podczas ładowania zajęć na żywo wystąpił błąd.</p>
      </div>
    );
  }

  if (data.pages.every((page) => !page.data.length)) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">Brak dodanych zajęć na żywo.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
      {data.pages.map((page, index) => (
        <React.Fragment key={index}>
          {page.data.map((liveLesson) => (
            <AdminLiveLessonCard
              key={liveLesson.id}
              lesson={liveLesson}
              setDialogOpen={setEditDialogOpen}
              setCurrentLesson={setCurrentLesson}
              setCurrentParticipantsLessonId={setCurrentParticipantsLessonId}
              setParticipantsDialogOpen={setParticipantsDialogOpen}
            />
          ))}
        </React.Fragment>
      ))}

      {hasNextPage && (
        <Button
          disabled={isFetching}
          onClick={() => fetchNextPage()}
        >
          {isFetching ? 'Ładowanie...' : 'Pokaż więcej'}
        </Button>
      )}

      {currentLesson && (
        <UpdateDialog
          liveLesson={currentLesson}
          open={editDialogOpen}
          setOpen={setEditDialogOpen}
        />
      )}

      {currentParticipantsLessonId && (
        <ParticipantsDialog
          lessonId={currentParticipantsLessonId}
          open={participantsDialogOpen}
          setOpen={setParticipantsDialogOpen}
        />
      )}
    </div>
  );
};
