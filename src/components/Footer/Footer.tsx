import Container from '../Container/Container';
import Link from 'next/link';
import Logo from '@/assets/oddechownia.svg';
import Instagram from '@/assets/instagram.svg';
import FooterLink from './FooterLink';
import { filteredRoutes, footerLinks } from '@/utils/navigation';
import { getUser } from '@/server/actions/user';

export default async function Footer() {
  const user = await getUser();

  return (
    <footer className="bg-matcha">
      <Container>
        <div className="grid grid-cols-1 gap-6 md:gap-0 md:grid-cols-4 md:justify-items-center">
          <Link
            className="block mr-8"
            href="/"
          >
            <Logo className="w-[200px]" />
          </Link>
          {[filteredRoutes(user), footerLinks].map((column, index) => (
            <ul
              key={index}
              className="space-y-4"
            >
              {column.map((link, index) => (
                <FooterLink
                  key={index}
                  href={link.href}
                  content={link.content}
                  target={link.target}
                />
              ))}
            </ul>
          ))}
          <Link
            className="bg-primaryFg inline-block p-4 rounded-full"
            href="https://www.instagram.com/weronikasyoga/"
            target="_blank"
          >
            <Instagram />
          </Link>
        </div>
      </Container>
    </footer>
  );
}
