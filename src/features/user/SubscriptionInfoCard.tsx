'use client';

import { Button } from '@/components/ui/button';
import { CircleCheck, CircleX } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  subscriptionStatus?: string;
  stripeCustomerId?: string;
  liveLessonsUsageCount?: number;
  className?: string;
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
  className,
}: Props) => {
  return (
    <div className={cn('flex flex-col gap-4 rounded-xl border p-4', className)}>
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
