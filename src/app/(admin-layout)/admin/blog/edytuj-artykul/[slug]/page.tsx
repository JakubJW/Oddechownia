import { getPostBySlug } from '@/lib/actions/post';
import { ClientComponent } from './clientForm';
import { notFound } from 'next/navigation';

export default async function UpdateArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <ClientComponent post={post} />;
}
