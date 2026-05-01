import { urlFor } from '@/sanity/imageUrlBuilder';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/infrastructure/services/blog.service';
import DocumentBody from '@/features/blog/post-body';
import { Image } from 'next-sanity/image';
import { client } from '@/sanity/client';
import Container from '@/components/Container/Container';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await client.fetch(
    `*[_type in ["post", "category"]].slug.current`
  );

  return slugs.map((slug: string) => ({ slug }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const postImageUrl = post.image ? urlFor(post.image).url() : null;

  return (
    <article className="prose prose-img:my-0 max-w-3xl mx-auto">
      <p>Opublikowano {format(new Date(post.publishedAt), 'yyyy-MM-dd')}</p>
      {postImageUrl && (
        <div className="relative w-full h-96 mb-8">
          <Image
            className="object-cover rounded-xl"
            src={postImageUrl}
            alt={post.image?.alt || 'Zdjęcie blogowe'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <h1 className="text-4xl font-bold mb-8">{post.title}</h1>
      {Array.isArray(post.body) && <DocumentBody value={post.body} />}
    </article>
  );
}
