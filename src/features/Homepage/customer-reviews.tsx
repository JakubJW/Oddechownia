import Container from '@/components/Container/Container';
import { HeaderTwo } from '@/components/Headers/headers';
import Carousel from '@/components/Carousel/Carousel';
import ReviewCard from '@/components/ReviewCard';

const mockReiews = [
  {
    id: 1,
    review:
      'Te praktyki to złoto, nagrywane jeszcze w tak cudnych miejscach. Polecajka prosto z ❤️',
  },
  {
    id: 2,
    review:
      'Polecam Wam praktykę jogi online z Weroniką w jej pięknej przestrzeni.',
  },
  {
    id: 3,
    review:
      'Jestem po praktyce jogi nidry, posłuchałam o energii męskiej i żeńskiej - jestem zachwycona ❤️',
  },
];

export default function CustomerReviews() {
  return (
    <section className="bg-primary-foreground">
      <Container>
        <HeaderTwo className="text-center font-light mb-8">
          Poznaj opinie innych
        </HeaderTwo>
        <Carousel
          hideArrows
          settings={{
            slidesToShow: 3,
            slidesToScroll: 1,
            dots: true,
            arrows: true,
            responsive: [
              {
                breakpoint: 640,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1,
                },
              },
              {
                breakpoint: 1280,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 1,
                },
              },
            ],
          }}
        >
          {mockReiews.map(({ review, id }) => (
            <ReviewCard
              key={id}
              review={review}
            />
          ))}
        </Carousel>
      </Container>
    </section>
  );
}
