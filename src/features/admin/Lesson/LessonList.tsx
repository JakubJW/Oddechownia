'use client';

import SortableLessonCard from './SortableLessonCard';
import { LessonWithVideo } from '@/db/types';
import { useState } from 'react';
import { closestCenter, DndContext } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';

interface LessonListProps {
  lessons?: LessonWithVideo[];
  courseSlug: string;
}

export default function LessonList({ lessons, courseSlug }: LessonListProps) {
  const [lessonsClone, setLessons] = useState(lessons);

  const calculatePosition = (newIndex: number, lessons: LessonWithVideo[]) => {
    let position;

    if (newIndex === 0 && lessons.length > 1) {
      position = lessons[1].position / 2;
    } else if (newIndex > 0 && newIndex < lessons?.length - 1) {
      position =
        lessons[newIndex + 1].position + lessons[newIndex + 1].position / 2;
    } else {
      position = lessons[lessons.length - 1].position + 1000;
    }

    return position;
  };

  const handleDragEnd = async (event: any) => {
    if (!lessonsClone) return;

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = lessonsClone.findIndex(({ id }) => id === active.id);
    const newIndex = lessonsClone.findIndex(({ id }) => id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const movedLesson = { ...lessonsClone[oldIndex] };

    movedLesson.position = calculatePosition(newIndex, lessonsClone);

    const updatedLessons = arrayMove(lessonsClone, oldIndex, newIndex).map(
      (lesson) => (lesson.id === movedLesson.id ? movedLesson : lesson)
    );

    setLessons(updatedLessons);

    await fetch(`/api/lessons/reorder/${movedLesson.id}`, {
      method: 'POST',
      body: JSON.stringify({ position: movedLesson.position }),
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
            ({ id, name, description, slug: lessonSlug, video }) => (
              <SortableLessonCard
                id={id}
                key={id}
                name={name}
                description={description}
                imageUrl={`https://image.mux.com/${video?.publicPlaybackId}/thumbnail.jpg?width=640`}
                href={`/admin/kurs/${courseSlug}/lekcje/${lessonSlug}`}
              />
            )
          )}
        </SortableContext>
      </DndContext>
    </div>
  );
}
