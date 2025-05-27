// import SubscriptionCard from '@/components/SubscriptionCard/SubscriptionCard';
import { Button } from '@/components/ui/button';

export interface OrderProps {
  nextStepDisabled: boolean;
}

export default function Order({ nextStepDisabled }: OrderProps) {
  return (
    <div className="flex flex-col col-span-4 col-start-9">
      <p className="font-bold text-xl mb-8">Twoje zamówienie</p>
      {/* <SubscriptionCard
        variant="popular"
        period={3}
        price={240}
      /> */}
      <p className="font-bold text-xl mt-8 mb-4">Podsumowanie</p>
      <div className="flex justify-between mb-8">
        <p>Do zapłaty:</p>
        <p className="font-bold text-xl">240zł</p>
      </div>
      <Button
        size="lg"
        disabled={nextStepDisabled}
      >
        Przejdź do posumowania
      </Button>
    </div>
  );
}
