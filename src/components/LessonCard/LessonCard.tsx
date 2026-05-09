import { formatDuration } from '@/lib/utils';
import { LessonDTO } from '@/server/models/lesson.models';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { ProgressBar } from '@/features/shared/ProgressBar';
import { LessonLabel } from '../LessonLabel';

const LessonCard = ({
  name,
  description,
  video,
  thumbnail,
  labels,
  percent,
}: Pick<
  LessonDTO,
  'name' | 'description' | 'video' | 'thumbnail' | 'labels'
> & { percent?: number }) => {
  return (
    <div className="card-hover-effect flex flex-col bg-white w-full rounded-xl min-h-[350px] h-full overflow-hidden">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={thumbnail}
          alt="Obraz"
          fill
          className="card-thumbnail object-cover"
        />
        <span className="absolute bottom-2 right-2 px-2 py-1 rounded-sm bg-black/75 text-white text-xs font-medium">
          {formatDuration(video?.duration)}
        </span>
        <ProgressBar percent={percent} />
        <div className="card-overlay absolute top-0 left-0 h-full w-full opacity-0 bg-muted/60 flex items-center justify-center">
          <div className="rounded-full bg-matcha p-6">
            <Play
              className="h-8 w-8 text-white"
              strokeWidth={1.5}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col grow px-4 py-6 xl:px-6 gap-4">
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
      </div>
    </div>
  );
};

export default LessonCard;
