'use client';

import { User } from '@/server/actions/user';
import { LiveLessonCardDTO } from '@/server/models/liveLesson.models';
import { useState } from 'react';
import SignUpDialog from './SignUpDialog';
import { LiveLessonCard } from './live-lesson-card';

type LiveLessonsGridProps = {
  lessons: LiveLessonCardDTO[];
  user: User;
};

export const LiveLessonsGrid = ({ lessons, user }: LiveLessonsGridProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<
    LiveLessonCardDTO | undefined
  >(undefined);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-8">
      {lessons.map((lesson) => (
        <LiveLessonCard
          setCurrentLesson={setCurrentLesson}
          setDialogOpen={setDialogOpen}
          key={lesson.id}
          lesson={lesson}
        />
      ))}
      {currentLesson && (
        <SignUpDialog
          user={user}
          liveLesson={currentLesson}
          open={dialogOpen}
          setOpen={setDialogOpen}
        />
      )}
    </div>
  );
};
