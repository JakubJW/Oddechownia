import Image from 'next/image';
import Link from 'next/link';

export interface PostCardProps {
  slug: string;
  title: string;
  image: string;
  createdAt: Date;
}

export const BlogCard = ({
  slug,
  title,
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
        height={300}
        className='w-full h-[250px] object-cover'
      />
      <div className="flex flex-col p-6 gap-4">
        <span className="inline-flex self-end text-sm text-blue-500">
          {createdAt.toLocaleDateString()}
        </span>
        <p className="text-lg text-black font-bold line-clamp-2">{title}</p>
      </div>
    </Link>
  );
};
