'use client';

import { Button } from '@/components/ui/button';
import { useProductMutations } from './hooks/use-product-mutations';
import { Loader2 } from 'lucide-react';
import { downloadEbook } from '@/server/actions/ebook';
import { useState } from 'react';

type Props = {
  productId: string;
  state: 'can_purchase' | 'can_claim' | 'can_download' | 'disabled';
  price: number;
};

export const GetEbookButton = ({ productId, state, price }: Props) => {
  const [buttonState, setButtonState] = useState(state);
  const { claimMutation, purchaseMutation } = useProductMutations();

  if (buttonState === 'can_purchase') {
    return (
      <Button
        onClick={() =>
          purchaseMutation.mutate({ productId, values: undefined })
        }
        disabled={purchaseMutation.isPending}
        size="lg"
        className="bg-white text-richBlack border border-richBlack hover:bg-muted"
      >
        Kup za&nbsp;
        {new Intl.NumberFormat('pl-PL', {
          style: 'currency',
          currency: 'PLN',
        }).format(price / 100)}
        {purchaseMutation.isPending && (
          <Loader2 className="size-4 mr-2 animate-spin" />
        )}
      </Button>
    );
  }

  if (buttonState === 'can_claim') {
    return (
      <Button
        onClick={() =>
          claimMutation.mutate(
            { productId, values: undefined },
            {
              onSuccess: () => setButtonState('can_download'),
            }
          )
        }
        disabled={claimMutation.isPending}
        size="lg"
        className="flex-1 text-richBlack"
      >
        Odbierz za darmo
        {claimMutation.isPending && <Loader2 className="size-4 animate-spin" />}
      </Button>
    );
  }

  if (buttonState === 'can_download') {
    return (
      <Button
        onClick={async () => {
          const url = await downloadEbook(productId);
          window.location.href = url;
        }}
        disabled={claimMutation.isPending}
        size="lg"
        className="flex-1 text-richBlack"
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
