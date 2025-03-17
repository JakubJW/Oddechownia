import { BlogCard } from '@/components/BlogCard';
import { getPaginatedPosts } from '@/lib/actions/post';
import Hero from '@/features/Blog/Hero';
import Container from '@/components/Container/Container';
import Pagination from '@/components/Pagination/Pagination';

export default async function Blog({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { page } = await searchParams;
  const { posts, perPage, total } = await getPaginatedPosts(page as string);

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
              <div className='flex mt-8 justify-center col-span-1 sm:col-span-2 xl:col-span-3'>
                <Pagination
                  page={page as string}
                  perPage={perPage}
                  total={total}
                  baseUrl="/blog"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
