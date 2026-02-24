import { useQuery } from '@tanstack/react-query';
import { Playlist } from '@/entities/models/playlist';
import { Lesson } from '@/entities/models/lesson';

export const usePlaylists = () => {
  return useQuery({
    queryKey: ['playlists'],
    queryFn: async () => {
      const res = await fetch(`/api/admin/user-practice-schedules/playlists`);
      if (!res.ok) throw new Error('Failed to fetch playlists');

      const data = await res.json();

      return data as Array<Playlist & { lessons: Lesson[] }>;
    },
  });
};
