'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ProductListItem } from '@/application/use-cases/product/get-product-for-user';
import { GetEbookButton } from './get-ebook-button';

export const EbookCard = ({
  id,
  image,
  name,
  price,
  slug,
  state,
}: Omit<ProductListItem, 'priceId'>) => {
  return (
    <Link
      href={`/produkty/${slug}`}
      className="ebook-card"
    >
      <div className="overflow-hidden rounded-xl">
        <Image
          src={image}
          alt={`Okładka ebooka pt. ${name}`}
          className="ebook-card-thumbnail transition ease-in-out duration-300 object-cover"
          width={1310}
          height={2046}
        />
      </div>
      <h2 className="mt-6 font-medium mb-4">{name}</h2>
      <div className="flex gap-2">
        <GetEbookButton
          productId={id}
          state={state}
          price={price}
        />
      </div>
    </Link>
  );
};
