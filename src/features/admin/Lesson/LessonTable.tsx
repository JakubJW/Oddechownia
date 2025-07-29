'use client';

import { attachLessonsToPlaylist } from '@/actions/playlist';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { LessonWithPlaylistsWithVideo } from '@/db/types';
import { formatDuration } from '@/lib/utils';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const findLessonsBelongingToPlaylist = (
  lessons: LessonWithPlaylistsWithVideo[],
  playlistSlug: string
) => {
  const result = lessons
    .filter((lesson) =>
      lesson.playlists.some((playlist) => playlist.slug === playlistSlug)
    )
    .map(({ id }) => id);

  return result;
};

export default function LessonTable({
  lessons,
  playlistSlug,
}: {
  lessons: LessonWithPlaylistsWithVideo[];
  playlistSlug: string;
}) {
  const [lessonsClone, setLessonsClone] = useState(lessons);
  const [newLessons, setNewLessons] = useState(
    new Set(findLessonsBelongingToPlaylist(lessons, playlistSlug))
  );

  useEffect(() => setLessonsClone(lessons), [lessons]);

  const addLesson = (id: number) =>
    setNewLessons((prevLessons) => new Set(prevLessons.add(id)));

  const removeLesson = (id: number) =>
    setNewLessons(
      (prevLessons) =>
        new Set([...prevLessons].filter((prevId) => prevId !== id))
    );

  const handleSubmit = async () => {
    const { data, success, error } = await attachLessonsToPlaylist(
      playlistSlug,
      Array.from(newLessons)
    );

    if (!success) {
      console.log(error);
    }
  };

  return (
    <>
      <table className="w-full">
        <thead>
          <tr>
            <th>Dodano</th>
            <th>Nazwa</th>
            <th>Czas trwania</th>
          </tr>
        </thead>
        <tbody>
          {lessonsClone.map(({ id, name, video }) => (
            <tr key={id}>
              <td>
                <Checkbox
                  checked={newLessons.has(id)}
                  onCheckedChange={(checked) =>
                    checked ? addLesson(id) : removeLesson(id)
                  }
                />
              </td>
              <td>
                <Image
                  height={120}
                  width={240}
                  alt="Obrazek"
                  src={`https://image.mux.com/${video?.publicPlaybackId}/thumbnail.jpg?width=640`}
                />
              </td>

              <td>{name}</td>
              <td>{formatDuration(video?.duration)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button onClick={handleSubmit}>Zapisz zmiany</Button>
    </>
  );
}
