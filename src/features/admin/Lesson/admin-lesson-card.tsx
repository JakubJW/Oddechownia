import { formatDuration } from '@/lib/utils';
import { LessonDTO } from '@/server/models/lesson.models';
import Image from 'next/image';
import { LessonLabel } from '@/components/LessonLabel';
import { Button } from '@/components/ui/button';

export const AdminLessonCard = ({
  name,
  description,
  video,
  thumbnail,
  labels,
  setDialogOpen,
  setCurrentLesson,
}: Pick<
  LessonDTO,
  'name' | 'description' | 'video' | 'thumbnail' | 'labels'
> & {
  setCurrentLesson: () => void;
  setDialogOpen: (state: boolean) => void;
}) => {
  return (
    <div className="lesson-card flex flex-col transition-all w-full duration-200 ease-in-out rounded-xl min-h-[350px] h-full overflow-hidden">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={thumbnail}
          alt="Obraz"
          fill
          className="lesson-card-thumbnail transition-all duration-200 ease-in-out object-cover"
        />
        <span className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/75 text-white text-xs font-medium">
          {formatDuration(video?.duration)}
        </span>
      </div>

      <div className="flex flex-col flex-grow px-4 py-6 xl:px-6 gap-4">
        <p className="text-black font-semibold line-clamp-2">{name}</p>
        <p className="text-sm  text-gray-400 line-clamp-2">{description}</p>
        <div className="flex gap-1 mt-auto">
          {labels.map(({ id, text, color }) => (
            <LessonLabel
              key={id}
              label={{ text, color }}
            />
          ))}
        </div>
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => {
            setCurrentLesson();
            setDialogOpen(true);
          }}
        >
          Edytuj
        </Button>
      </div>
    </div>
  );
};
