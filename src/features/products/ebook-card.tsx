'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type Props = {
  thumbnail: string;
  title: string;
  price: number;
  slug: string;
  includedInSubscription: boolean;
};

export const EbookCard = ({
  thumbnail,
  title,
  price,
  slug,
  includedInSubscription,
}: Props) => {
  return (
    <div className="relative">
      <Image
        src={thumbnail}
        alt={`Okładka ebooka pt. ${title}`}
        className="object-cover rounded-xl"
        width={1310}
        height={2046}
      />
      <h2 className="mt-6 font-medium">{title}</h2>
      <div className="flex gap-2">
        <Button className="mt-4 rounded-full bg-richBlack text-white">
          Kup teraz{' '}
          {new Intl.NumberFormat('pl-PL', {
            style: 'currency',
            currency: 'PLN',
          }).format(price / 100)}
        </Button>
        <Link
          href={`/oferta/${slug}`}
          className="mt-4 rounded-full bg-richBlack text-white"
        >
          Zobacz szczegóły
        </Link>
        <Button className="mt-4 rounded-full bg-richBlack text-white">
          Odbierz ebooka
        </Button>
      </div>
    </div>
  );
};
