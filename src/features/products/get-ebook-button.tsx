'use client';

import { Button } from '@/components/ui/button';
import { useProductMutations } from './hooks/use-product-mutations';
import { Loader2 } from 'lucide-react';
import { downloadEbook } from '@/server/actions/ebook';

type Props = {
  productId: string;
  state: 'can_purchase' | 'can_claim' | 'can_download';
};

export const GetEbookButton = ({ productId, state }: Props) => {
  const { claimMutation, purchaseMutation } = useProductMutations();

  if (state === 'can_purchase') {
    return (
      <Button
        onClick={() => purchaseMutation.mutate(productId)}
        disabled={purchaseMutation.isPending}
        size="lg"
        className="bg-white text-richBlack border border-richBlack hover:bg-muted"
      >
        Zakup za 99 zł
        {purchaseMutation.isPending && (
          <Loader2 className="size-4 mr-2 animate-spin" />
        )}
      </Button>
    );
  }

  if (state === 'can_claim') {
    return (
      <Button
        onClick={() => claimMutation.mutate(productId)}
        disabled={claimMutation.isPending}
        size="lg"
        className="text-richBlack"
      >
        Odbierz za darmo
        {claimMutation.isPending && <Loader2 className="size-4 animate-spin" />}
      </Button>
    );
  }

  if (state === 'can_download') {
    return (
      <Button
        onClick={async () => {
          const url = await downloadEbook(productId);
          window.location.href = url;
        }}
        disabled={claimMutation.isPending}
        size="lg"
        className="text-richBlack"
      >
        Pobierz
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
