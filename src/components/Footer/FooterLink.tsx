import Link from 'next/link';

export interface FooterLinkProps {
  href: string;
  content: string;
}

export default function FooterLink({ href, content }: FooterLinkProps) {
  return (
    <li>
      <Link className='block text-white text-lg' href={href}>{content}</Link>
    </li>
  );
}
