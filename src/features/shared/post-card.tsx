import Link from 'next/link';
import { Image } from 'next-sanity/image';
import { Badge } from '@/components/ui/badge';

type Props = {
  id: string;
  slug: string;
  publishedAt: string;
  title: string;
  lead: string;
  image: string | null;
  category?: string;
};

export const PostCard = ({ id, slug, title, lead, image, category }: Props) => {
  return (
    <li
      key={id}
      className="lesson-card flex flex-col transition-all bg-white w-full duration-200 ease-in-out rounded-xl min-h-[350px] h-full overflow-hidden"
    >
      <Link href={`/blog/${slug}`}>
        <div className="relative aspect-video overflow-hidden rounded-xl">
          {image && (
            <Image
              src={image}
              alt="Author photo"
              className="object-cover"
              fill
            />
          )}
          {category && (
            <Badge className="absolute bg-matcha-light text-richBlack top-2 left-2">
              {category}
            </Badge>
          )}
        </div>
        <div className="flex flex-col flex-grow py-6  gap-4">
          <h2 className="text-black font-semibold line-clamp-2">{title}</h2>
          <p className="text-sm  text-gray-400 line-clamp-3">{lead}</p>
        </div>
      </Link>
    </li>
  );
};
