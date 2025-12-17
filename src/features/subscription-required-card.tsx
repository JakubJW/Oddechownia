'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useRenewSubscriptionMutation } from './user/hooks/useRenewSubscriptionMutation';
import { User } from '@/server/actions/user';
import { Loader2 } from 'lucide-react';

type Props = {
  user: User;
  subscriptionPriceId: string;
};

export const SubscriptionRequiredCard = ({
  user,
  subscriptionPriceId,
}: Props) => {
  const mutation = useRenewSubscriptionMutation();

  return (
    <div className="w-full lg:max-w-[512px] xl:max-w-[640px] 2xl:max-w-[768px] ml-auto py-32 px-4 lg:pr-16 xl:pr-24 2xl:pr-32 self-center">
      <div>
        <h1 className="text-4xl font-light mb-4">Subskrypcja nieaktywna</h1>
        <p className="text-muted-foreground mb-8">
          Do skorzystania z tej funkcji wymagana jest aktywna subskrypcja. Jeśli
          twoje członkostwo wygasło lub nie dokończyłeś płatności podczas
          rejestracji, kliknij poniższy przycisk. Zostaniesz przeniesiony do
          płatności Stripe.
        </p>
      </div>
      <Button
        size="lg"
        className="w-full"
        disabled={mutation.isPending}
        onClick={() =>
          mutation.mutate({
            priceId: subscriptionPriceId,
            clientReferenceId: user!.id,
            customerId: user!.stripeCustomerId!,
          })
        }
      >
        Przejdź do płatności
        {mutation.isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <ArrowRight className="size-4" />
        )}
      </Button>
    </div>
  );
};
