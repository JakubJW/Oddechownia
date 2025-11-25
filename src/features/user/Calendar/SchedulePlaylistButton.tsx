// src/features/calendar/components/AddToCalendarButton.tsx
'use client';

import { CalendarPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SchedulePlaylistDialog } from './SchedulePlaylistDialog';
import { useState } from 'react';
import { PlaylistDetailDTO } from '@/server/models/playlist.models';
import { LessonDTO } from '@/server/models/lesson.models';

interface SchedulePlaylistButton {
  playlist: PlaylistDetailDTO<LessonDTO[]>;
}

export const SchedulePlaylistButton = ({
  playlist,
}: SchedulePlaylistButton) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <CalendarPlus className="mr-2 h-4 w-4" />
        Zaplanuj
      </Button>

      <SchedulePlaylistDialog
        open={open}
        onOpenChange={setOpen}
        playlistId={playlist.id}
        playlistName={playlist.name}
        lessons={playlist.lessons.map((l) => ({
          lessonId: l.id,
          title: l.name,
          duration: l.video!.duration,
        }))}
      />
    </>
  );
};
