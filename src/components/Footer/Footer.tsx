import Container from '../Container/Container';
import Link from 'next/link';
import Logo from '@/assets/oddechownia.svg';
import Instagram from '@/assets/instagram.svg';
import FooterLink from './FooterLink';
import { footerLinks, navbarLinks } from '@/utils/navigation';

export default async function Footer() {
  return (
    <footer className="bg-matcha">
      <Container>
        <div className="grid grid-cols-1 gap-6 md:gap-0 md:grid-cols-4 md:justify-items-center">
          <Link
            className="place-self-start block"
            href="/"
          >
            <Logo className="w-[200px]" />
          </Link>
          {[navbarLinks, footerLinks].map((column, index) => (
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
          <a
            className="p-2 self-start rounded-full hover:bg-richBlack text-white hover:text-matcha"
            href="https://www.instagram.com/weronikasyoga/"
            target="_blank"
          >
            <Instagram className="size-6 text-richBlack" />
          </a>
        </div>
      </Container>
    </footer>
  );
}
