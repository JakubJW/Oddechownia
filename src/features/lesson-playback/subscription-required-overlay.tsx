import Link from 'next/link';
import { Gem } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

type Props = {
  thumbnail: string;
};

export const SubscriptionRequiredOverlay = ({ thumbnail }: Props) => {
  return (
    <div className="relative mb-4 md:mb-8 md:rounded-xl overflow-hidden aspect-video">
      <Image
        alt="Miniaturka lekcji"
        src={thumbnail}
        fill
        className="object-cover"
      />
      <div className="absolute bg-black bg-opacity-60 top-0 left-0 h-full w-full flex flex-col items-center justify-center">
        <Gem
          className="text-matcha h-1/4 w-1/4"
          strokeWidth={1.5}
        />
        <p className="sm:text-lg text-white font-medium mb-4 mt-8">
          Treść tylko dla subskrybentów.
        </p>
        <Link
          className={cn(
            buttonVariants({ size: 'lg' }),
            'rounded-full sm:text-lg text-richBlack sm:h-14 mb-4'
          )}
          href={'/rejestracja'}
        >
          Rozpocznij 3-dniowy trial
        </Link>
      </div>
    </div>
  );
};
