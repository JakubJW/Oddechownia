import type { Metadata } from 'next';
import { PostCard } from '@/features/shared/post-card';
import { getPostsAsCardDTOs } from '@/infrastructure/services/blog.service';

export const metadata: Metadata = {
  title: 'Blog',
};

export default async function BlogArticles() {
  const postDTOs = await getPostsAsCardDTOs();

  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <ul className="grid sm:grid-cols-2 xl:grid-cols-4 gap-8">
        {postDTOs.map((post) => (
          <PostCard
            key={post.id}
            id={post.id}
            title={post.title}
            lead={post.lead}
            slug={post.slug}
            publishedAt={post.publishedAt}
            image={post.image}
            category={post.category}
          />
        ))}
      </ul>
    </>
  );
}
