'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ProductListItem } from '@/application/use-cases/product/get-product-for-user';
import { GetEbookButton } from './get-ebook-button';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const EbookCard = ({
  id,
  image,
  name,
  price,
  slug,
  state,
  disabled,
}: Omit<ProductListItem, 'priceId'>) => {
  return (
    <div className="relative">
      <Image
        src={image}
        alt={`Okładka ebooka pt. ${name}`}
        className="object-cover rounded-xl"
        width={1310}
        height={2046}
      />
      <h2 className="mt-6 font-medium mb-4">{name}</h2>
      <div className="flex gap-2">
        {!disabled && (
          <GetEbookButton
            productId={id}
            state={state}
            price={price}
          />
        )}
        <Link
          href={`/produkty/${slug}`}
          className={cn(
            buttonVariants({ size: 'lg' }),
            'rounded-full bg-richBlack text-white flex-1'
          )}
        >
          Dowiedz się więcej
        </Link>
      </div>
    </div>
  );
};
