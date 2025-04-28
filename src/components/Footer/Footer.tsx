import Container from '../Container/Container';
import Link from 'next/link';
import Logo from '../../../public/oddechownia.svg';
import Image from 'next/image';
import Facebook from '../../../public/facebook.svg';
import Instagram from '../../../public/instagram.svg';
import FooterLink from './FooterLink';

const footerLinks = [
  [
    {
      content: 'Nasze kursy',
      href: '/nasze-kursy',
    },
    {
      content: 'Blog',
      href: '/blog',
    },
    {
      content: 'O nas',
      href: '/o-nas',
    },
  ],
  [
    {
      content: 'Kontakt',
      href: '/kontakt',
    },
    {
      content: 'Regulamin',
      href: '/regulamin',
    },
    {
      content: 'Polityka prywatności',
      href: '/polityka-prywatnosci',
    },
  ],
];

export default function Footer() {
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
              className='w-[200px]'
            />
          </Link>
          {footerLinks.map((column, index) => (
            <ul key={index} className='space-y-4'>
              {column.map(({ href, content }, index) => (
                <FooterLink
                  key={index}
                  href={href}
                  content={content}
                />
              ))}
            </ul>
          ))}
          <div className="space-x-4">
            <Link
              className=" bg-primaryFg inline-block p-4 rounded-full"
              href="#"
            >
              <Image
                src={Facebook}
                alt="Facebook logo"
              />
            </Link>
            <Link
              className=" bg-primaryFg inline-block p-4 rounded-full"
              href="#"
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
