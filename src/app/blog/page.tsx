import { BlogCard } from '@/components/BlogCard';
import { getPosts } from '@/lib/actions/post';
import Hero from '@/features/Blog/Hero';
import Container from '@/components/Container/Container';

export default async function Blog() {
  const posts = await getPosts();

  return (
    <>
      <Hero />
      <section>
        <Container>
          <div className="grid grid-cols-12">
            <div className="col-span-12 lg:col-span-2">es</div>
            <div className="col-span-12 lg:col-span-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {posts.map(({ id, title, slug, thumbnailUrl, createdAt }) => (
                  <BlogCard
                    key={id}
                    title={title}
                    slug={slug}
                    image={thumbnailUrl}
                    createdAt={createdAt}
                  />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
