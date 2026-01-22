import Container from '@/components/Container/Container';
import { HeaderTwo } from '@/components/Headers/headers';
import Carousel from '@/components/Carousel/Carousel';
import ReviewCard from '@/components/ReviewCard';

const mockReiews = [
  {
    customerName: 'Joanna',
    review:
      'Joga dla początkujących to był strzał w dziesiątkę! Nigdy wcześniej nie  ćwiczyłam jogi, a dzięki tym lekcjom krok po kroku nauczyłam się  podstawowych pozycji i technik oddychania. Instruktor jest bardzo  cierpliwy i tłumaczy wszystko bardzo dokładnie. Polecam każdemu, kto  chce zacząć swoją przygodę z jogą!',
  },
  {
    customerName: 'Ania',
    review: 'Bardzo fajny kurs, polecam!',
  },
  {
    customerName: 'Ada',
    review: 'Bardzo fajny kurs, polecam!',
  },
  {
    customerName: 'Wiktoria',
    review: 'Bardzo fajny kurs, polecam!',
  },
];

export default function CustomerReviews() {
  return (
    <section className="bg-primary-foreground">
      <Container>
        <HeaderTwo className="text-center mb-8">Poznaj opinie innych</HeaderTwo>
        <Carousel>
          {mockReiews.map(({ customerName, review }, index) => (
            <ReviewCard
              key={index}
              customerName={customerName}
              review={review}
            />
          ))}
        </Carousel>
      </Container>
    </section>
  );
}
