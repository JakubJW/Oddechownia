import Container from '@/components/Container/Container';
import { getRequiredUser } from '@/lib/data';

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await getRequiredUser();

  return <Container className="py-8 lg:py-24 h-full">{children}</Container>;
}
