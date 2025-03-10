import Hero from '@/features/Blog/Hero';
import Container from '@/components/Container/Container';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Hero />
      <section>
        <Container>
          <div className='grid grid-cols-12'>
            <div className='col-span-2'>es</div>
            <div className='col-span-10'>{children}</div>
          </div>
        </Container>
      </section>
    </>
  );
}
