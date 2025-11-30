'use client';

import { Button } from '@/components/ui/button';
import { CircleCheck, CircleX } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  subscriptionStatus?: string;
  stripeCustomerId?: string;
  liveLessonsUsageCount?: number;
};

const getStatusContent = (status?: string) => {
  switch (status) {
    case 'active':
      return 'Aktywna';

    default:
      return 'Nieaktywna';
  }
};

const getItemStyles = (status?: string) => {
  switch (status) {
    case 'active':
      return 'text-emerald-500';

    default:
      return 'text-red-500';
  }
};

export const SubscriptionInfoCard = ({
  subscriptionStatus,
  stripeCustomerId,
  liveLessonsUsageCount,
}: Props) => {
  return (
    <div className="flex flex-col gap-4 rounded-xl border p-4">
      <div className="flex justify-between items-center">
        <p>Subskrypcja</p>
        <div
          className={cn(
            'flex items-center gap-2 ',
            getItemStyles(subscriptionStatus)
          )}
        >
          <span className="text-sm font-light">
            {getStatusContent(subscriptionStatus)}
          </span>
          {subscriptionStatus === 'active' ? (
            <div className="relative bg-emerald-100 rounded-full flex items-center justify-center p-2">
              <CircleCheck className="z-10 size-4" />
            </div>
          ) : (
            <div className="relative bg-red-100 rounded-full flex items-center justify-center p-2">
              <CircleX className="z-10 size-4" />
            </div>
          )}
        </div>
      </div>
      <div className="text-sm font-light text-muted-foreground space-y-2">
        <p>
          Pełny dostęp do Studia Jogi Online, dwóch darmowych zajęć na żywo w
          miesiącu oraz historycznych nagrań.
        </p>
        <p>
          Wykorzystane bezpłatne zajęcia na żywo:{' '}
          <span className="font-semibold text-primary">
            {liveLessonsUsageCount} z 2
          </span>
        </p>
      </div>

      <form
        action="/api/stripe/create-checkout-portal"
        method="POST"
      >
        <input
          type="hidden"
          name="customerId"
          value={stripeCustomerId!}
        />
      </form>
      <Button
        type="submit"
        className="self-end"
        variant="secondary"
      >
        Zarządzaj członkostwem
      </Button>
    </div>
  );
};
