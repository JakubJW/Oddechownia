import { formatTimeForInput } from '@/lib/utils';
import { Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LiveLessonCardDTO } from '@/server/models/liveLesson.models';
import Image from 'next/image';

type Props = {
  lesson: LiveLessonCardDTO;
  setDialogOpen: (state: boolean) => void;
  setCurrentLesson: (lesson: LiveLessonCardDTO) => void;
};

const getButtonContent = (
  isListed: boolean,
  isRegistered: boolean,
  isPaymentPending: boolean
) => {
  if (!isListed && !isRegistered) return 'Zarezerwuj miejsce';
  if (isRegistered && isPaymentPending) return 'Dokończ płatność';
  if (isRegistered && !isPaymentPending) return 'Już zapisany';
  return 'Zapisy zamknięte';
};

export const LiveLessonCard = ({
  lesson,
  setCurrentLesson,
  setDialogOpen,
}: Props) => {
  return (
    <div className="lesson-card flex flex-col transition-all w-full duration-200 ease-in-out rounded-xl min-h-[350px] h-full overflow-hidden">
      <div className="relative aspect-video overflow-hidden">
        {/* <div className="flex gap-1">
          {lesson.isRegistered && <Badge>Zapisano</Badge>}
          {lesson.isPaymentPending && (
            <Badge variant="outline">Płatność oczekująca</Badge>
            )}
            </div> */}
        <Image
          src={'/hero.jpg'}
          alt="Obraz"
          fill
          className="lesson-card-thumbnail transition-all duration-200 ease-in-out object-cover"
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
      <div className="flex flex-col flex-grow px-4 py-6 xl:px-6 gap-4">
        <p className="text-richBlack font-semibold line-clamp-2">
          {lesson.title}
        </p>
        <p className="text-sm  text-gray-400 line-clamp-4">
          {lesson.description}
        </p>
        <Button
          className="w-full"
          disabled={
            lesson.isListed || (lesson.isRegistered && !lesson.isPaymentPending)
          }
          onClick={() => {
            setCurrentLesson(lesson);
            setDialogOpen(true);
          }}
        >
          {getButtonContent(
            lesson.isListed,
            lesson.isRegistered,
            lesson.isPaymentPending
          )}
        </Button>
      </div>
    </div>
  );
};
