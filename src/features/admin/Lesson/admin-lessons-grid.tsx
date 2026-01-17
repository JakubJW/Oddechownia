'use client';

import { Button } from '@/components/ui/button';
import { AdminEditLessonDTO } from '@/server/models/lesson.models';
import React, { useState } from 'react';
import { UpdateLessonDialog } from './update-dialog';
import { AdminLessonCard } from './admin-lesson-card';
import { useLessons } from './hooks/use-lessons';

export const AdminLessonsGrid = () => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<
    AdminEditLessonDTO | undefined
  >(undefined);

  const { isPending, isError, data, isFetching, hasNextPage, fetchNextPage } =
    useLessons();

  if (isPending) {
    return <p>Ładowanie...</p>;
  }

  if (isError) {
    return (
      <div className="p-4 text-center">
        <p>Podczas lekcji wystąpił błąd.</p>
      </div>
    );
  }

  if (data.pages.every((page) => !page.data.length)) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">Brak dodanych lekcji.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-6">
      {data.pages.map((page, index) => (
        <React.Fragment key={index}>
          {page.data.map((lesson) => (
            <AdminLessonCard
              key={lesson.id}
              name={lesson.name}
              description={lesson.description}
              video={lesson.video}
              thumbnail={lesson.thumbnail}
              labels={lesson.labels}
              setDialogOpen={setEditDialogOpen}
              setCurrentLesson={() => setCurrentLesson(lesson)}
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
        <UpdateLessonDialog
          lesson={currentLesson}
          open={editDialogOpen}
          setOpen={setEditDialogOpen}
        />
      )}
    </div>
  );
};
