import { Lesson } from '@/server/db/types';
import PlaylistElement from './PlaylistElement';

interface PlaylistProps {
  heading: string;
  lessons: Lesson[];
  courseSlug: string;
  currentPlaybackId?: string;
}

export default function Playlist({
  heading,
  lessons,
  courseSlug,
  currentPlaybackId,
}: PlaylistProps) {
  return (
    <div className="w-full border rounded-xl p-6 bg-white">
      <p className="font-semibold text-lg mb-4">{heading}</p>
      <div>
        {lessons.map(({ id, name, video }) => {
          if (!video) {
            return;
          } else
            return (
              <PlaylistElement
                key={id}
                name={name}
                courseSlug={courseSlug}
                isActive={currentPlaybackId === video.publicPlaybackId}
                duration={video.duration}
                videoPlaybackId={video?.publicPlaybackId}
                thumbnailUrl={`https://image.mux.com/${video?.publicPlaybackId}/thumbnail.jpg?width=640`}
              />
            );
        })}
      </div>
    </div>
  );
}
