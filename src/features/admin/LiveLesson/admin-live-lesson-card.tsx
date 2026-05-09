import { formatTimeForInput } from '@/lib/utils';
import { Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { AdminLiveLessonCardDTO } from '@/entities/models/live-lesson';

type Props = {
  lesson: AdminLiveLessonCardDTO;
  setDialogOpen: (state: boolean) => void;
  setCurrentLesson: (lesson: AdminLiveLessonCardDTO) => void;
  setParticipantsDialogOpen: (state: boolean) => void;
  setCurrentParticipantsLessonId: (id: string) => void;
};

export const AdminLiveLessonCard = ({
  lesson,
  setCurrentLesson,
  setDialogOpen,
  setParticipantsDialogOpen,
  setCurrentParticipantsLessonId,
}: Props) => {
  return (
    <div className="card-hover-effect flex flex-col w-full rounded-xl min-h-[350px] h-full overflow-hidden">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={lesson.image ? lesson.image : '/hero.jpg'}
          alt={`Miniatura lekcji ${lesson.title}`}
          fill
          className="card-thumbnail object-cover"
        />
        <div className="absolute top-2 left-2 space-y-1">
          <Badge className="flex items-center gap-2">
            <Calendar className="size-4" />
            <span className="text-xsm">
              {new Date(lesson.scheduledAt).toLocaleDateString('pl-PL', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </Badge>
          <Badge className="flex items-center gap-2">
            <Clock className="size-4" />
            <span className="text-xs">
              {`${formatTimeForInput(lesson.scheduledAt)} (${
                lesson.duration
              } min)`}
            </span>
          </Badge>
        </div>
      </div>
      <div className="flex flex-col grow px-4 py-6 xl:px-6 gap-4">
        <p className="text-richBlack font-semibold line-clamp-2">
          {lesson.title}
        </p>
        <p className="text-sm  text-gray-400 line-clamp-4">
          {lesson.description}
        </p>
        <div className="flex mt-auto gap-2">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => {
              setCurrentParticipantsLessonId(lesson.id);
              setParticipantsDialogOpen(true);
            }}
          >
            Uczestnicy ({lesson.currentParticipants})
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => {
              setCurrentLesson(lesson);
              setDialogOpen(true);
            }}
          >
            Edytuj
          </Button>
        </div>
      </div>
    </div>
  );
};
