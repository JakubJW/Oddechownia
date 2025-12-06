import Container from '../Container/Container';
import Link from 'next/link';
import Logo from '../../../public/oddechownia.svg';
import Image from 'next/image';
import Facebook from '../../../public/facebook.svg';
import Instagram from '../../../public/instagram.svg';
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
            <Image
              src={Logo}
              alt="Oddechownia logo"
              priority
              className="w-[200px]"
            />
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
                />
              ))}
            </ul>
          ))}
          <div className="space-x-4">
            <Link
              className="bg-primaryFg inline-block p-4 rounded-full"
              href="#"
            >
              <Image
                src={Facebook}
                alt="Facebook logo"
              />
            </Link>
            <Link
              className="bg-primaryFg inline-block p-4 rounded-full"
              href="https://www.instagram.com/weronikasyoga/"
              target="_blank"
            >
              <Image
                src={Instagram}
                alt="Instagram logo"
              />
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
