import { getPostBySlug } from '@/lib/actions/post';
import { ClientComponent } from './clientForm';

export default async function UpdateArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  return <ClientComponent post={post} />;
}
