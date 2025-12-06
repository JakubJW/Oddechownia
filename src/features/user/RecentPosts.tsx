import { RecentPostDTO } from '@/server/models/post.models';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/Avatar';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

type Props = {
  posts: RecentPostDTO[];
  className?: string;
};

const RecentPosts = ({ posts, className }: Props) => {
  return (
    <div className={cn('pt-[20px]', className)}>
      <div className="flex items-end justify-between pl-4  mb-4">
        <p>Ostatnie wpisy</p>
        <Link
          href="/spolecznosc"
          className="inline-flex items-center hover:underline text-sm text-muted-foreground"
        >
          Społeczność <ArrowRight className="size-4 ml-2" />
        </Link>
      </div>
      {posts.map((post) => (
        <div key={post.id}>
          <div className="border border-matcha rounded-lg p-4 mb-4">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <Avatar
                  author={post.author}
                  isAdmin={true}
                />
                <div>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                      locale: pl,
                    })}
                  </p>
                  <h3 className="text-sm ">{post.title}</h3>
                  <p
                    className="line-clamp-2 text-sm md:text-md font-light  whitespace-pre-wrap leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentPosts;
