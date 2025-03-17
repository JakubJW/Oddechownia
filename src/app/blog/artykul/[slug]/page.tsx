import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/lib/actions/post';
import type { Metadata } from 'next';
import Container from '@/components/Container/Container';
import HeaderOne from '@/components/Headers/HeaderOne';
import Image from 'next/image';
import Carousel from '@/components/Carousel/Carousel';
import { BlogCard } from '@/components/BlogCard';
import { getPosts } from '@/lib/actions/post';
import HeaderTwo from '@/components/Headers/HeaderTwo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }
  return {
    title: post.title,
  };
}

export default async function Post({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }
  const posts = await getPosts();
  const { title, thumbnailUrl, content, createdAt } = post;

  return (
    <>
      <section>
        <Container className="grid grid-cols-12">
          <Image
            width={1920}
            height={300}
            src={thumbnailUrl}
            alt="Miniatura"
            className="object-cover h-[300px] col-span-12 rounded-xl"
          />
          <div className="col-span-8 space-y-8 mt-8">
            <span className="block text-primaryFg">
              {createdAt.toLocaleDateString()}
            </span>
            <HeaderOne>{title}</HeaderOne>
            <div className="leading-relaxed" dangerouslySetInnerHTML={{ __html: content }}></div>
          </div>
        </Container>
      </section>
      <section>
        <Container>
          <HeaderTwo className="xl:text-3xl mb-10 text-primaryFg">Czytaj dalej</HeaderTwo>
          <Carousel>
            {posts.map(({ id, title, slug, thumbnailUrl, createdAt }) => (
              <BlogCard
                key={id}
                title={title}
                slug={slug}
                image={thumbnailUrl}
                createdAt={createdAt}
              />
            ))}
          </Carousel>
        </Container>
      </section>
    </>
  );
}
