import SubscriptionCard from '@/components/SubscriptionCard/SubscriptionCard';
import Container from '@/components/Container/Container';
import HeaderTwo from '@/components/Headers/HeaderTwo';

const mockSubscriptions = [
  {
    period: 3,
    price: 135,
    variant: 'default',
  },
  {
    period: 3,
    price: 240,
    variant: 'popular',
  },
  {
    period: 3,
    price: 420,
    variant: 'default',
  },
] as const;

export default function AvailableSubscriptions() {
  return (
    <section>
      <Container className="overflow-hidden">
        <hgroup className="text-center max-w-[800px] mx-auto space-y-6 mb-24">
          <HeaderTwo>
            Wybierz <span className="text-primaryFg">swój</span> plan
          </HeaderTwo>
          <p className="text-xl">
            Każdy z pakietów możesz dowolnie przedłużać, aby cieszyć się
            dostępem do platformy tak, jakby to był jogowy Netflix.
          </p>
        </hgroup>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-10">
          {mockSubscriptions.map(({ period, price, variant }, index) => (
            <SubscriptionCard
              key={index}
              period={period}
              price={price}
              variant={variant}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
