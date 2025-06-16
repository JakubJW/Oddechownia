'use client';

import { useSortable } from '@dnd-kit/sortable';
import { GripVertical } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { CSS } from '@dnd-kit/utilities';

export interface LessonCardProps {
  id: number;
  name: string;
  description: string;
  href: string;
  imageUrl: string;
}

export default function SortableLessonCard({
  id,
  name,
  description,
  href,
  imageUrl,
}: LessonCardProps) {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  };

  return (
    <div
      className="py-2 flex items-center gap-4 cursor-grab active:cursor-grabbing bg-whiteBg"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="text-primaryFg flex-shrink-0" />
      <Link
        className="flex gap-4"
        href={href}
      >
        <Image
          src={imageUrl}
          width={150}
          height={96}
          alt={`${name} lesson thumbnail`}
          className="rounded-lg"
        />
        <div>
          <p className="font-bold line-clamp-2">{name}</p>
          <p className="line-clamp-2 text-gray-500">{description}</p>
        </div>
      </Link>
    </div>
  );
}
