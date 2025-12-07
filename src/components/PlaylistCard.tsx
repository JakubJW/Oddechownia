'use client';

import { Badge } from '@/components/ui/badge';
import { CirclePlay, Clock } from 'lucide-react';
import LessonCard from '@/components/LessonCard/LessonCard';
import Link from 'next/link';
import { PlaylistDetailDTO } from '@/server/models/playlist.models';
import { LessonDTO } from '@/server/models/lesson.models';
import { ArrowRight } from 'lucide-react';
import Carousel from './Carousel/Carousel';

interface PlaylistCardProps {
  playlist: PlaylistDetailDTO<LessonDTO[]>;
  hideToolbar?: boolean;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({
  playlist,
  hideToolbar,
}) => {
  return (
    <div>
      {!hideToolbar && (
        <div className="flex gap-8">
          <div className="space-y-2 w-full gap-2 items-center">
            <p className="text-xl font-bold">{playlist.name}</p>
            <div className="flex justify-between">
              <div className="space-x-2">
                <Badge variant="secondary">
                  <CirclePlay className="h-4 w-4 mr-2" />
                  <span>{playlist.lessons.length} lekcji</span>
                </Badge>
                <Badge variant="secondary">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>
                    {Math.floor(playlist.totalDurationInSeconds / 3600)} h{' '}
                    {Math.floor((playlist.totalDurationInSeconds % 3600) / 60)}{' '}
                    min
                  </span>
                </Badge>
              </div>
              <Link
                className="flex items-center text-muted-foreground text-sm hover:underline"
                href={`/studio-jogi-online/${playlist.slug}`}
              >
                Zobacz więcej <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      )}
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
        </Carousel>
      </div>
    </div>
  );
};

export default PlaylistCard;
