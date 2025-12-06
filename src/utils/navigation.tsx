import { User } from '@/server/actions/user';

const navbarLinks = [
  {
    content: 'Studio Jogi Online',
    href: '/studio-jogi-online',
    allowGuest: true,
  },
  // { content: 'O nas', href: '/o-nas' },
  { content: 'Zajęcia na żywo', href: '/zajecia-na-zywo', allowGuest: true },
  { content: 'Społeczność', href: '/spolecznosc', allowGuest: false },
];

export const footerLinks = [
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
];

export const filteredRoutes = (user: User) => {
  if (user) {
    return navbarLinks;
  }

  return navbarLinks.filter((link) => link.allowGuest);
};
