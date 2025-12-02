'use client';

import PlaylistCard from '@/components/PlaylistCard';
import { LessonDTO } from '@/server/models/lesson.models';
import { PlaylistDetailDTO } from '@/server/models/playlist.models';
import { SearchBar } from './SearchBar';
import { useMemo, useState } from 'react';

type Props = { playlists: PlaylistDetailDTO<LessonDTO[]>[] };

export const StudioJogiOnline = ({ playlists }: Props) => {
  const [query, setQuery] = useState('');
  const filteredPlaylists = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();

    if (!normalizedQuery) return playlists;

    return playlists
      .map((playlist) => {
        const matchingLessons = playlist.lessons.filter((lesson) => {
          const nameMatch = lesson.name.toLowerCase().includes(normalizedQuery);
          const descMatch =
            lesson.description?.toLowerCase().includes(normalizedQuery) ||
            false;
          const labelMatch = lesson.labels.some((label) =>
            label.text.toLowerCase().includes(query)
          );

          return nameMatch || descMatch || labelMatch;
        });

        return {
          ...playlist,
          lessons: matchingLessons,
        };
      })
      .filter((playlist) => playlist.lessons.length > 0);
  }, [query, playlists]);

  return (
    <div>
      <SearchBar
        query={query}
        onQueryChange={setQuery}
      />
      <div className="space-y-12">
        {filteredPlaylists.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            playlist={playlist}
          />
        ))}
      </div>
    </div>
  );
};
