import { LessonWithPlaylistsWithVideo } from '@/db/types';
import { formatDuration } from '@/lib/utils';
import { Clock } from 'lucide-react';
import Image from 'next/image';

const LessonCard = ({
  name,
  description,
  video,
}: Partial<LessonWithPlaylistsWithVideo>) => {
  return (
    <div className="rounded-xl overflow-hidden">
      <div className="relative">
        <Image
          src={`https://image.mux.com/${video?.publicPlaybackId}/thumbnail.jpg?width=640`}
          alt="Obraz"
          width={640}
          height={420}
          className="w-full h-[250px] object-cover"
        />
        <div className="absolute top-2 left-2 space-y-2">
          <div className="bg-primaryBg text-primaryFg flex gap-2 items-center rounded-md p-2">
            <Clock />
            <span className="leading-none">
              {formatDuration(video?.duration)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col p-6 gap-4">
        <p className="text-lg text-black font-bold line-clamp-2">{name}</p>
        <p className="text-gray-400 line-clamp-3">{description}</p>
      </div>
    </div>
  );
};

export default LessonCard;
