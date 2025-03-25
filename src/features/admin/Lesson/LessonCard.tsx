import Link from 'next/link';
import Image from 'next/image';

export interface LessonCardProps {
  name: string;
  description: string;
  href: string;
  imageUrl: string;
}

export default function LessonCard({
  name,
  description,
  href,
  imageUrl,
}: LessonCardProps) {
  return (
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
  );
}
