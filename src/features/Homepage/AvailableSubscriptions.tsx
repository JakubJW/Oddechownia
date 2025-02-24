import SubscriptionCard from '@/components/SubscriptionCard/SubscriptionCard';
import Container from '@/components/Container/Container';
import HeaderTwo from '@/components/Headers/HeaderTwo';

export default function AvailableSubscriptions() {
  return (
    <section>
      <Container>
        <hgroup className='text-center max-w-[800px] mx-auto space-y-8'>
          <HeaderTwo>Wybierz <span className="text-primaryFg">swój</span> plan</HeaderTwo>
          <p className='text-xl'>
            Każdy z pakietów możesz dowolnie przedłużać, aby cieszyć się
            dostępem do platformy tak, jakby to był jogowy Netflix.
          </p>
        </hgroup>
        <div className="grid grid-cols-3 justify-items-center gap-10 mt-24">
          <SubscriptionCard
            period={3}
            price={135}
            variant="default"
          />
          <SubscriptionCard
            period={6}
            price={240}
            variant="popular"
          />
          <SubscriptionCard
            period={12}
            price={420}
            variant="default"
          />
        </div>
      </Container>
    </section>
  );
}
