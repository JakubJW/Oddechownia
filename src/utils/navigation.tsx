import { User } from '@/server/actions/user';

const navbarLinks = [
  {
    content: 'Studio Jogi Online',
    href: '/studio-jogi-online',
    allowGuest: true,
    target: '_self',
  },
  {
    content: 'Zajęcia na żywo',
    href: '/zajecia-na-zywo',
    allowGuest: true,
    target: '_self',
  },
  {
    content: 'Społeczność',
    href: '/spolecznosc',
    allowGuest: false,
    target: '_self',
  },
];

export const footerLinks = [
  {
    content: 'Regulamin',
    href: '/regulamin.pdf',
    target: '_blank',
    allowGuest: true,
  },
  {
    content: 'Polityka prywatności',
    href: '/polityka_prywatnosci.pdf',
    target: '_blank',
    allowGuest: true,
  },
];

export const filteredRoutes = (user: User) => {
  if (user) {
    return navbarLinks;
  }

  return navbarLinks.filter((link) => link.allowGuest);
};
