import { formatDuration } from '@/lib/utils';
import { LessonDTO } from '@/server/models/lesson.models';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { ProgressBar } from '@/features/shared/ProgressBar';

const LessonCard = ({
  name,
  description,
  video,
  thumbnail,
}: Pick<LessonDTO, 'name' | 'description' | 'video' | 'thumbnail'>) => {
  return (
    <div className="lesson-card transition-all w-full duration-200 ease-in-out rounded-xl min-h-[350px] h-full overflow-hidden">
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
        {/* <ProgressBar percent={}/> */}
        <div className="lesson-card-play-overlay transition-all duration-200 ease-in-out absolute top-0 left-0 h-full w-full opacity-0 bg-muted/60 flex items-center justify-center">
          <div className="rounded-full bg-matcha p-4">
            <Play className="h-12 w-12 text-white" />
          </div>
        </div>
      </div>

      <div className="flex flex-col px-4 py-6 md:px-6 gap-4">
        <p className="text-black font-semibold line-clamp-2">{name}</p>
        <p className="text-sm  text-gray-400 line-clamp-3">{description}</p>
      </div>
    </div>
  );
};

export default LessonCard;
