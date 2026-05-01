import Container from '@/components/Container/Container';
import { getCategoriesAsDTO } from '@/infrastructure/services/blog.service';
import Link from 'next/link';

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categoryDTOs = await getCategoriesAsDTO();

  return (
    <section className="min-h-screen">
      <Container>
        {/* <ul className="sticky top-28 max-h-min">
          {categoryDTOs.map((category) => (
            <li key={category.id}>
              <Link href={`/blog/kategoria/${category.slug}`}>
                {category.title}
              </Link>
            </li>
          ))}
        </ul> */}
        {children}
      </Container>
    </section>
  );
}
