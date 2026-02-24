import Link from 'next/link';

export interface FooterLinkProps {
  href: string;
  content: string;
  target?: string;
}

export default function FooterLink({ href, content, target }: FooterLinkProps) {
  if (target === '_blank') {
    return (
      <li>
        <a
          className="block text-richBlack text-lg"
          href={href}
          target={target}
        >
          {content}
        </a>
      </li>
    );
  }

  return (
    <li>
      <Link
        className="block text-richBlack text-lg"
        href={href}
        target={target}
      >
        {content}
      </Link>
    </li>
  );
}
