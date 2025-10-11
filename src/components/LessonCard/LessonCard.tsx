import { Lesson } from '@/db/types';
import { formatDuration } from '@/lib/utils';
import Image from 'next/image';

const LessonCard = ({ name, description, video }: Partial<Lesson>) => {
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
        <span className="absolute bottom-2 right-2 bg-black text-white text-xs p-1 rounded-sm">
          {formatDuration(video?.duration)}
        </span>
      </div>

      <div className="flex flex-col p-6 gap-4">
        <p className="text-lg text-black font-bold line-clamp-2">{name}</p>
        <p className="text-gray-400 line-clamp-3">{description}</p>
      </div>
    </div>
  );
};

export default LessonCard;
