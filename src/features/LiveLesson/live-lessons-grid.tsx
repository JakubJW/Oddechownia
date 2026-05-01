'use client';

import { User } from '@/server/actions/user';
import { useMemo, useState } from 'react';
import SignUpDialog from './sign-up-dialog';
import { LiveLessonCard } from './live-lesson-card';
import { LiveLessonProduct } from '@/entities/models/live-lesson';

type LiveLessonsGridProps = {
  lessons: LiveLessonProduct[];
  user: User;
};

export const LiveLessonsGrid = ({ lessons, user }: LiveLessonsGridProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string | undefined>(
    undefined
  );

  const currentLesson = useMemo(() => {
    return lessons.find((lesson) => lesson.id === selectedLessonId);
  }, [selectedLessonId, lessons]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-8">
        {lessons.map((lesson) => (
          <LiveLessonCard
            setCurrentLessonId={setSelectedLessonId}
            setDialogOpen={setDialogOpen}
            key={lesson.id}
            id={lesson.id}
            title={lesson.title}
            description={lesson.description}
            thumbnail={lesson.image}
            duration={lesson.duration}
            scheduledAt={lesson.scheduledAt}
            state={lesson.state}
          />
        ))}
      </div>

      {currentLesson && (
        <SignUpDialog
          user={user}
          open={dialogOpen}
          setOpen={setDialogOpen}
          productId={currentLesson.productId}
          title={currentLesson.title}
          description={currentLesson.description}
          scheduledAt={currentLesson.scheduledAt}
          state={currentLesson.state}
          price={currentLesson.price}
        />
      )}
    </>
  );
};
