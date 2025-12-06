import Container from '@/components/Container/Container';
import Link from 'next/link';
import { getUser } from '@/server/actions/user';
import { UserRoles } from '@/server/db/consts';
// import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  // const h  = await headers();

  if (!user) {
    redirect('/admin/logowanie');
  }

  if (user.role !== UserRoles.ADMIN) {
    redirect('/moje-konto');
  }

  return (
    <section>
      <Container>
        <div className="grid grid-cols-12">
          <div className="flex flex-col gap-4 col-span-2">
            <Link href="/admin">Dashboard</Link>
            <Link href="/admin/playlisty">Playlisty</Link>
            <Link href="/admin/lekcje">Lekcje</Link>
            <Link href="/admin/zajecia-na-zywo">Zajęcia na żywo</Link>
          </div>
          <div className="col-span-10">{children}</div>
        </div>
      </Container>
    </section>
  );
}
