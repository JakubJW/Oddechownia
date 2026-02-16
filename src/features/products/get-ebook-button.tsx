'use client';

import { Button } from '@/components/ui/button';
import { downloadEbook } from '@/server/actions/ebook';

type Props = {
  userId?: string;
  productId: string;
  slug: string;
  stripePriceId: string;
  state: 'can_purchase' | 'can_claim' | 'can_download';
};

export const GetEbookButton = ({ userId, slug, state }: Props) => {
  const handleDownload = async (slug: string) => {
    const url = await downloadEbook(slug);
    window.location.href = url;
  };

  if (state === 'can_purchase') {
    return (
      <Button
        // onClick={() => createCheckoutSession()}
        size="lg"
        className="bg-white text-richBlack border border-richBlack hover:bg-muted"
      >
        Zakup za 99 zł
      </Button>
    );
  }

  if (state === 'can_download' || state === 'can_claim') {
    return (
      <Button
        onClick={() => handleDownload(slug)}
        size="lg"
        className="text-richBlack"
      >
        Pobierz za darmo
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      className="text-richBlack"
      disabled
    >
      Dostęp odblokuje się po pierwszej płatności
    </Button>
  );
};
