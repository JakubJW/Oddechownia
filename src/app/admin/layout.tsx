import Container from '@/components/Container/Container';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <Container>
        <div className="grid grid-cols-12">
          <div className="flex flex-col gap-4 col-span-2">
            <Link href="/admin">Dashboard</Link>
            <Link href="/admin/blog">Blog</Link>
          </div>
          <div className="col-span-10">{children}</div>
        </div>
      </Container>
    </section>
  );
}
