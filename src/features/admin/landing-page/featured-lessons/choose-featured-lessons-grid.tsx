'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { LessonDetailDTO } from '@/server/models/lesson.models';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

type Props = {
  initialLessons: Pick<LessonDetailDTO, 'id' | 'thumbnail' | 'name'>[];
  allLessons: Pick<LessonDetailDTO, 'id' | 'thumbnail' | 'name'>[];
};

export const FeaturedLessons = ({ initialLessons, allLessons }: Props) => {
  const [newLessons, setNewLessons] = useState(
    new Set(
      allLessons
        .filter((lesson) => initialLessons.some((l) => lesson.id === l.id))
        .map(({ id }) => id)
    )
  );

  const addLesson = (id: number) =>
    setNewLessons((prevLessons) => new Set(prevLessons.add(id)));

  const removeLesson = (id: number) =>
    setNewLessons(
      (prevLessons) =>
        new Set([...prevLessons].filter((prevId) => prevId !== id))
    );

  const handleSubmit = async () => {
    await fetch('/api/admin/content-blocks/featured-lessons', {
      method: 'PATCH',
      body: JSON.stringify({ lessonIds: Array.from(newLessons) }),
    });
  };

  return (
    <div>
      <table className="w-full">
        <thead>
          <tr>
            <th>Dodano</th>
            <th>Miniaturka</th>
            <th>Nazwa</th>
          </tr>
        </thead>
        <tbody>
          {allLessons.map(({ id, name, thumbnail }) => (
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
                  src={thumbnail}
                />
              </td>
              <td>{name}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button onClick={handleSubmit}>Zapisz zmiany</Button>
    </div>
  );
};
