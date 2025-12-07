import Carousel from '@/components/Carousel/Carousel';
import VideoCard from '@/components/VideoCard/VideoCard';
import { HeaderTwo } from '@/components/Headers/headers';
import Container from '@/components/Container/Container';

const mockVideos = [
  {
    id: 1,
    title: 'Yoga Antystresowa: Uwolnij Napięcie i Znajdź Spokój',
    description: 'Yoga Antystresowa: Uwolnij Napięcie i Znajdź Spokój',
    duration: 3600,
    videoUrl: 'vTDmDBASFO4vUFGNwEXxvD7tQAuQdh018a01100dYaUoWY',
  },
  {
    id: 3,
    title: 'Yoga Antystresowa: Uwolnij Napięcie i Znajdź Spokój',
    description: 'Yoga Antystresowa: Uwolnij Napięcie i Znajdź Spokój',
    duration: 3600,
    videoUrl: 'vTDmDBASFO4vUFGNwEXxvD7tQAuQdh018a01100dYaUoWY',
  },
  {
    id: 3,
    title: 'Yoga Antystresowa: Uwolnij Napięcie i Znajdź Spokój',
    description: 'Yoga Antystresowa: Uwolnij Napięcie i Znajdź Spokój',
    duration: 3600,
    videoUrl: 'vTDmDBASFO4vUFGNwEXxvD7tQAuQdh018a01100dYaUoWY',
  },
];

export default function CourseVideosPreview() {
  return (
    <section className="bg-primary-foreground">
      <Container>
        <div className="max-w-[600px] space-y-6 mb-24">
          <HeaderTwo>
            Zobacz, jak wyglądają <br />{' '}
            <span className="text-primaryFg">praktyki ze mną</span>
          </HeaderTwo>
          <p className="leading-normal">
            Obejrzyj fragmenty naszych kursów jogi online i zobacz, co oferują
            nasi doświadczeni instruktorzy. Znajdź kurs idealny dla siebie,
            niezależnie od poziomu.
          </p>
        </div>
        <Carousel settings={{ slidesToShow: 3 }}>
          {mockVideos.map(({ title, description, duration, videoUrl, id }) => (
            <VideoCard
              id={id}
              key={id}
              title={title}
              description={description}
              duration={duration}
              videoUrl={videoUrl}
            />
          ))}
        </Carousel>
      </Container>
    </section>
  );
}
