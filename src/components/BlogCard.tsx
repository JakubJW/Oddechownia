import Image from 'next/image';
import Link from 'next/link';

export interface PostCardProps {
  slug: string;
  title: string;
  description?: string;
  image: string;
  createdAt: string;
}

export const BlogCard = ({
  slug,
  title,
  description,
  image,
  createdAt,
}: PostCardProps) => {
  return (
    <Link
      className="rounded-xl bg-white overflow-hidden"
      href={`/blog/artykul/${slug}`}
    >
      <Image
        src={image}
        alt="Obraz"
        width={400}
        height={184}
      />
      <div className="flex flex-col p-4 gap-4">
        <span className="inline-flex self-end text-xs text-blue-500">
          {createdAt}
        </span>
        <p className="text-lg text-black font-bold line-clamp-2">{title}</p>
        <p className="text-base text-gray-300 line-clamp-3">{description}</p>
      </div>
    </Link>
  );
};
