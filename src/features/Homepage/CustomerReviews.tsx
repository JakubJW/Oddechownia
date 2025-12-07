import Container from '@/components/Container/Container';
import { HeaderTwo } from '@/components/Headers/headers';
import Carousel from '@/components/Carousel/Carousel';
import ReviewCard from '@/components/ReviewCard';

const mockReiews = [
  {
    customerName: 'Jan Kowalski',
    review:
      'Joga dla początkujących to był strzał w dziesiątkę! Nigdy wcześniej nie  ćwiczyłam jogi, a dzięki tym lekcjom krok po kroku nauczyłam się  podstawowych pozycji i technik oddychania. Instruktor jest bardzo  cierpliwy i tłumaczy wszystko bardzo dokładnie. Polecam każdemu, kto  chce zacząć swoją przygodę z jogą!',
    rating: 5,
    date: '2021-01-01',
  },
  {
    customerName: 'Ania Kowalska',
    review: 'Bardzo fajny kurs, polecam!',
    rating: 4,
    date: '2021-01-01',
  },
  {
    customerName: 'Andrzej Nowak',
    review: 'Bardzo fajny kurs, polecam!',
    rating: 5,
    date: '2021-01-01',
  },
];

export default function CustomerReviews() {
  return (
    <section className="bg-gradient-to-b from-steelBlue-foreground to-white-background">
      <Container>
        <div className="text-center space-y-6 mb-24 max-w-[800px] mx-auto">
          <HeaderTwo>Jak oceniają nas klienci?</HeaderTwo>
          <p>
            Dokładamy wszelkich starań, aby nasze kursy były jak najwyższej
            jakości i odpowiadały waszym potrzebom.
          </p>
        </div>
        <Carousel>
          {mockReiews.map(({ customerName, review, rating, date }, index) => (
            <ReviewCard
              key={index}
              customerName={customerName}
              review={review}
              rating={rating}
              date={date}
            />
          ))}
        </Carousel>
      </Container>
    </section>
  );
}
