'use client';

import { Button } from '@/components/ui/button';
import {
  CircleAlert,
  CircleCheck,
  CircleX,
  DollarSign,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { subscriptions } from '@/server/db/schema';
import { InferSelectModel } from 'drizzle-orm';
import { useRenewSubscriptionMutation } from './hooks/useRenewSubscriptionMutation';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

type Props = {
  subscription?: InferSelectModel<typeof subscriptions>;
  stripeCustomerId?: string;
  liveLessonsUsageCount?: number;
  className?: string;
  userId: string;
};

const getStatusContent = (status?: string) => {
  switch (status) {
    case 'active':
      return 'Aktywna';
    case 'past_due':
      return 'Nieopłacona';
    case 'trialing':
      return 'Okres próbny';
    default:
      return 'Nieaktywna';
  }
};

const getItemStyles = (status?: string) => {
  switch (status) {
    case 'active':
      return 'text-emerald-500';

    case 'past_due':
      return 'text-yellow-500';

    case 'trialing':
      return 'text-blue-500';

    default:
      return 'text-red-500';
  }
};

const StatusBagde = ({
  subscription,
}: {
  subscription?: InferSelectModel<typeof subscriptions>;
}) => {
  if (subscription && subscription.cancelAtPeriodEnd) {
    return (
      <div className="space-y-2 text-sm font-light">
        <div className="flex items-center gap-2 text-orange-500">
          <span>W trakcie anulowania</span>
          <div className="relative bg-orange-100 rounded-full flex items-center justify-center p-2">
            <CircleAlert className="z-10 size-4" />
          </div>
        </div>
        <span className="block text-muted-foreground">
          Wygasa: &nbsp;
          {format(new Date(subscription.currentPeriodEnd), 'dd LLLL YYY', {
            locale: pl,
          })}
        </span>
      </div>
    );
  } else {
    return (
      <div
        className={cn(
          'flex items-center gap-2 ',
          getItemStyles(subscription?.status)
        )}
      >
        <span className="text-sm font-light">
          {getStatusContent(subscription?.status)}
        </span>
        {subscription?.status === 'active' && (
          <div className="relative bg-emerald-100 rounded-full flex items-center justify-center p-2">
            <CircleCheck className="z-10 size-4" />
          </div>
        )}
        {subscription?.status === 'trialing' && (
          <div className="relative bg-blue-100 rounded-full flex items-center justify-center p-2">
            <Info className="z-10 size-4" />
          </div>
        )}
        {subscription?.status === 'past_due' && (
          <div className="relative bg-yellow-100 rounded-full flex items-center justify-center p-2">
            <DollarSign className="z-10 size-4" />
          </div>
        )}
        {subscription?.status === 'cancelled' && (
          <div className="relative bg-red-100 rounded-full flex items-center justify-center p-2">
            <CircleX className="z-10 size-4" />
          </div>
        )}
      </div>
    );
  }
};

export const SubscriptionInfoCard = ({
  subscription,
  stripeCustomerId,
  liveLessonsUsageCount,
  className,
  userId,
}: Props) => {
  const mutation = useRenewSubscriptionMutation();

  return (
    <div
      className={cn(
        'flex flex-col h-min gap-4 rounded-xl shadow-md border p-4',
        className
      )}
    >
      <div className="flex justify-between items-center">
        <p>Subskrypcja</p>
        <StatusBagde subscription={subscription} />
      </div>
      <div className="text-sm font-light text-muted-foreground space-y-2">
        <p>Dostęp do:</p>
        <ul className="list-inside list-disc">
          <li>Studia Jogi Online</li>
          <li>Dwóch darmowych lekcji na żywo w ciągu miesiąca</li>
          <li>Nagrań z poprzednich lekcji na żywo</li>
        </ul>
        <p>
          Wykorzystane bezpłatne zajęcia na żywo:{' '}
          <span className="font-semibold text-primary">
            {liveLessonsUsageCount} z 2
          </span>
        </p>
      </div>

      <div className="flex gap-4">
        {!subscription ? (
          <Button
            onClick={() =>
              mutation.mutate({
                priceId: 'price_1S0pELFWpOu2Y0ISnvpNPOaU',
                clientReferenceId: userId,
                customerId: stripeCustomerId!,
              })
            }
            className="self-end"
          >
            Dołącz do Oddechowni
          </Button>
        ) : subscription.status === 'canceled' ? (
          <Button
            onClick={() =>
              mutation.mutate({
                priceId: 'price_1S0pELFWpOu2Y0ISnvpNPOaU',
                clientReferenceId: userId,
                customerId: stripeCustomerId!,
              })
            }
            className="self-end"
          >
            Odnów członkstwo
          </Button>
        ) : (
          <form
            action="/api/stripe/create-checkout-portal"
            method="POST"
          >
            <input
              type="hidden"
              name="customerId"
              value={stripeCustomerId!}
            />
            <Button
              type="submit"
              className="self-end"
              variant="secondary"
            >
              Zarządzaj członkostwem
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
