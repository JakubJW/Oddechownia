import Container from '@/components/Container/Container';
import { getRequiredUser } from '@/lib/data';
import { Wind } from 'lucide-react';

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getRequiredUser();

  return (
    <Container className="py-24">
      <div className="pb-8 mb-8">
        <h1 className="text-xl font-light">
          Witaj ponownie, &nbsp;
          <span className="text-primary font-light">
            {user.firstName}
            <Wind
              className="size-6 inline ml-1"
              strokeWidth={1}
            />
          </span>
        </h1>
      </div>
      {children}
    </Container>
  );
}
