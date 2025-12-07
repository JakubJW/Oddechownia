import Link from 'next/link';

export interface FooterLinkProps {
  href: string;
  content: string;
  target?: string;
}

export default function FooterLink({ href, content, target }: FooterLinkProps) {
  return (
    <li>
      <Link
        className="block text-white text-lg"
        href={href}
        target={target}
      >
        {content}
      </Link>
    </li>
  );
}
