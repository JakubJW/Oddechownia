'use client';

import { useSortable } from '@dnd-kit/sortable';
import { GripVertical, Edit } from 'lucide-react';
import Link from 'next/link';
import { CSS } from '@dnd-kit/utilities';
import { Checkbox } from '@/components/ui/checkbox';

export interface SortablePlaylistElementProps {
  id: number;
  name: string;
  description: string;
  href: string;
  isPublished: boolean;
  lessonCount: number;
}

export default function SortablePlaylistElement({
  id,
  name,
  href,
  description,
  isPublished,
  lessonCount
}: SortablePlaylistElementProps) {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className="bg-background"
    >
      <td className="py-4 pl-4">
        <GripVertical
          className="text-primaryFg flex-shrink-0 cursor-grab active:cursor-grabbing active:outline-none focus:outline-none"
          {...attributes}
          {...listeners}
        />
      </td>
      <td className="py-4">
        <p className="line-clamp-2">{name}</p>
      </td>
      <td>
        <p className="line-clamp-2 whitespace-pre">{description}</p>
      </td>
      <td>
        <p className="line-clamp-2">{lessonCount}</p>
      </td>
      <td className="py-4">
        <Checkbox
          disabled={true}
          checked={isPublished}
          className="disabled:cursor-default"
        />
      </td>
      <td className="py-4">
        <Link
          className="inline-flex gap-2 items-center text-matcha hover:underline"
          href={href}
        >
          <Edit className="h-4 w-4" />
          Edytuj
        </Link>
      </td>
    </tr>
  );
}
