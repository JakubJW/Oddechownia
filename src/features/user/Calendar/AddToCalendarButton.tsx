// src/features/calendar/components/AddToCalendarButton.tsx
'use client';

import { CalendarPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScheduleLessonDialog } from './ScheduleLessonDialog';
import { useState } from 'react';

interface AddToCalendarButtonProps {
  lessonId: number;
  playlistId?: number;
  lessonTitle: string;
}

export const AddToCalendarButton = ({
  lessonId,
  playlistId,
  lessonTitle,
}: AddToCalendarButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <CalendarPlus className="mr-2 h-4 w-4" />
        Zaplanuj
      </Button>

      <ScheduleLessonDialog
        open={open}
        onOpenChange={setOpen}
        lessonId={lessonId}
        playlistId={playlistId}
        defaultTitle={lessonTitle}
      />
    </>
  );
};
