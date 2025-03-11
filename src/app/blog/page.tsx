import { BlogCard } from '@/components/BlogCard';
import { getPosts } from '@/lib/actions/post';

export default async function Blog() {
  const posts = await getPosts();

  return (
    <div className="grid grid-cols-3 gap-6">
      {posts.map(
        (
          { id, title, slug, shortDescription, thumbnailUrl, createdAt },
          index
        ) => (
          <BlogCard
            id={id}
            key={index}
            title={title}
            slug={slug}
            description={shortDescription || ''}
            image={thumbnailUrl}
            createdAt={new Date(createdAt).toLocaleDateString()}
          />
        )
      )}
    </div>
  );
}
