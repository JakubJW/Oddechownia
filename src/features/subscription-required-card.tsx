'use client';

import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardHeader, CardFooter } from '@/components/ui/card';
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
      <Card>
        <CardHeader>
          <CardTitle>Wymagana subskrypcja</CardTitle>
        </CardHeader>
        <CardFooter>
          <Button
            disabled={mutation.isPending}
            onClick={() =>
              mutation.mutate({
                priceId: subscriptionPriceId,
                clientReferenceId: user!.id,
                customerId: user!.stripeCustomerId!,
              })
            }
          >
            Przejdź do checkoutu
            {mutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ArrowRight className="size-4" />
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
