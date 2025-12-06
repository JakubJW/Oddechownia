'use client';

import SortableLessonCard from './SortableLessonCard';
import { useState } from 'react';
import { closestCenter, DndContext } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { AdminEditPlaylistLessonDTO } from '@/server/models/lesson.models';

interface LessonListProps {
  lessons?: AdminEditPlaylistLessonDTO[];
  courseSlug: string;
}

export default function LessonList({ lessons, courseSlug }: LessonListProps) {
  const [lessonsClone, setLessons] = useState(lessons);

  const calculateNewPosition = (
    index: number,
    list: AdminEditPlaylistLessonDTO[]
  ) => {
    if (index === 0) {
      if (list.length === 1) return 1024;
      return list[1].position / 2;
    }

    if (index === list.length - 1) {
      return list[index - 1].position + 1024;
    }

    const prevPosition = list[index - 1].position;
    const nextPosition = list[index + 1].position;

    return (prevPosition + nextPosition) / 2;
  };

  const handleDragEnd = async (event: any) => {
    if (!lessonsClone) return;

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = lessonsClone.findIndex(({ id }) => id === active.id);
    const newIndex = lessonsClone.findIndex(({ id }) => id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedList = arrayMove(lessonsClone, oldIndex, newIndex);

    const newPosition = calculateNewPosition(newIndex, reorderedList);

    const updatedLessons = reorderedList.map((lesson, index) => {
      if (index === newIndex) {
        return { ...lesson, position: newPosition };
      }
      return lesson;
    });

    setLessons(updatedLessons);

    const movedItemId = reorderedList[newIndex].playlistLessonId;

    await fetch(`/api/lessons/reorder/${movedItemId}`, {
      method: 'POST',
      body: JSON.stringify({ position: newPosition }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message);
        }
        return res.json();
      })
      .catch((error) => {
        console.log(error);
        setLessons(lessonsClone);
      });
  };

  if (!lessonsClone) return <p>Nie masz żadnych lekcji</p>;

  return (
    <div>
      <DndContext
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
      >
        <SortableContext
          strategy={verticalListSortingStrategy}
          items={lessonsClone.map(({ id }) => id)}
        >
          {lessonsClone.map(
            ({ id, name, description, slug: lessonSlug, thumbnail }) => (
              <SortableLessonCard
                id={id}
                key={id}
                name={name}
                description={description}
                imageUrl={thumbnail}
                href={`/admin/kurs/${courseSlug}/lekcje/${lessonSlug}`}
              />
            )
          )}
        </SortableContext>
      </DndContext>
    </div>
  );
}
