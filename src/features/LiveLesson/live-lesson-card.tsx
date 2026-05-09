import { formatTimeForInput } from '@/lib/utils';
import { Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { PURCHASE_STATE } from '@/entities/models/purchase';

type Props = {
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  scheduledAt: string;
  duration: number;
  state: PURCHASE_STATE;
  setDialogOpen: (state: boolean) => void;
  setCurrentLessonId: (id: string) => void;
};

const getButtonContent = (state: PURCHASE_STATE) => {
  switch (state) {
    case PURCHASE_STATE.CAN_CLAIM:
      return 'Zapisz się za darmo';
    case PURCHASE_STATE.CAN_PURCHASE:
      return 'Zarezerwuj miejsce';

    case PURCHASE_STATE.CLAIMED:
    case PURCHASE_STATE.PURCHASED:
      return 'Zapisano';
    default:
      return 'Zapisy zakończone';
  }
};

export const LiveLessonCard = ({
  id,
  title,
  description,
  thumbnail,
  scheduledAt,
  duration,
  state,
  setCurrentLessonId,
  setDialogOpen,
}: Props) => {
  return (
    <div className="card-hover-effect flex flex-col w-full rounded-xl min-h-[350px] h-full overflow-hidden">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={thumbnail || '/hero.jpg'}
          alt="Obraz"
          fill
          className="card-thumbnail object-cover"
        />
        <div className="absolute top-2 left-2 space-y-1">
          <Badge className="flex items-center gap-2">
            <Calendar className="size-4" />
            <span className="text-xsm">
              {new Date(scheduledAt).toLocaleDateString('pl-PL', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </Badge>
          <Badge className="flex items-center gap-2">
            <Clock className="size-4" />
            <span className="text-xs">
              {`${formatTimeForInput(scheduledAt)} (${duration} min)`}
            </span>
          </Badge>
        </div>
      </div>
      <div className="flex flex-col grow px-4 py-6 xl:px-6 gap-4">
        <p className="text-richBlack font-semibold line-clamp-2">{title}</p>
        <p className="text-sm  text-gray-400 line-clamp-4">{description}</p>
        <Button
          className="w-full"
          disabled={
            state === PURCHASE_STATE.CLAIMED ||
            state === PURCHASE_STATE.PURCHASED
          }
          onClick={() => {
            setCurrentLessonId(id);
            setDialogOpen(true);
          }}
        >
          {getButtonContent(state)}
        </Button>
      </div>
    </div>
  );
};
