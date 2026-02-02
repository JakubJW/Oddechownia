'use client';

import Brandmark from '@/assets/Brandmark.svg';
import LessonCard from '@/components/LessonCard/LessonCard';
import { Badge } from '@/components/ui/badge';
import { LessonDTO } from '@/server/models/lesson.models';
import { PlaylistDetailDTO } from '@/server/models/playlist.models';
import { Gem, Play } from 'lucide-react';
import Link from 'next/link';
import Carousel from './Carousel/Carousel';
import { HeaderTwo } from './Headers/headers';

interface PlaylistCardProps {
  playlist: PlaylistDetailDTO<LessonDTO[]>;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  return (
    <div>
      <div className="flex flex-wrap justify-between">
        <HeaderTwo className="text-2xl leading-normal xl:text-3xl xl:leading-relaxed">
          {playlist.name}
        </HeaderTwo>
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="text-sm"
            >
              <span>{playlist.lessons.length} filmów</span>
            </Badge>
            {playlist.isAccessibleForFree ? (
              <Badge className="text-sm bg-emerald-100 text-emerald-500">
                <Play className="size-3.5 mr-2" />
                <span>Oglądaj za darmo</span>
              </Badge>
            ) : (
              <Badge className="text-sm bg-richBlack text-matcha">
                <Gem
                  className="size-3.5 mr-2"
                  strokeWidth={2}
                />
                <span>Subskrypcja</span>
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Carousel>
          {playlist.lessons.map((lesson) => (
            <Link
              key={lesson.id}
              className="h-full"
              href={`/studio-jogi-online/${playlist.slug}/${lesson.slug}`}
            >
              <LessonCard
                thumbnail={lesson.thumbnail}
                name={lesson.name}
                description={lesson.description}
                video={lesson.video}
                labels={lesson.labels}
              />
            </Link>
          ))}
          <Link href={`/studio-jogi-online/${playlist.slug}`}>
            <div className="overflow-hidden relative min-h-[350px] bg-matcha-light rounded-xl flex justify-center items-center">
              <Brandmark className="z-0 absolute bottom-0 right-0 w-3/4 h-3/4 text-matcha-foreground" />
              <span className="z-10 bg-richBlack text-matcha font-semibold rounded-full px-4 py-2">
                Zobacz wszystko
              </span>
            </div>
          </Link>
        </Carousel>
      </div>
    </div>
  );
};

export default PlaylistCard;
