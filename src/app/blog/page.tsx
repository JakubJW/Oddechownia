import { BlogCard } from '@/components/BlogCard';
import { getPosts } from '@/lib/actions/post';

export default async function Blog() {
  const posts = await getPosts();

  return (
    <div className="grid grid-cols-3 gap-6">
      {posts.map(
        ({ title, slug, shortDescription, thumbnailUrl, createdAt }, index) => (
          <BlogCard
            key={index}
            title={title}
            slug={slug}
            description={shortDescription}
            image={thumbnailUrl}
            createdAt={new Date(createdAt).toLocaleDateString()}
          />
        )
      )}
    </div>
  );
}
