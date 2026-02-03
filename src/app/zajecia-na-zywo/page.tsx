import Container from '@/components/Container/Container';
import { LiveLessonsGrid } from '@/features/LiveLesson/live-lessons-grid';
import { getUser } from '@/server/actions/user';
import { LiveLessonsService } from '@/server/services/liveLessons.service';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Zajęcia na żywo`,
  description:
    'Dołącz do mnie na spotkaniach na żywo (Zoom), podczas których praktykujemy razem w czasie rzeczywistym. To przestrzeń wspólnej obecności, uważności i łagodnej pracy z ciałem, oddechem i umysłem - bez wychodzenia z domu.',
};

export default async function LiveLessons() {
  const user = await getUser();
  const lessons = await LiveLessonsService.getLiveLessonsWithUserStatus(user);

  return (
    <>
      {/* <Hero /> */}
      <section>
        <Container>
          <hgroup className="text-center max-w-3xl mx-auto space-y-6 mb-24">
            <h1 className="text-2xl leading-normal xl:text-4xl xl:leading-relaxed">
              Zajęcia na żywo online
            </h1>
            <p className="font-montserrat font-light text-xl">
              Dołącz do mnie na spotkaniach na żywo (Zoom), podczas których
              praktykujemy razem w czasie rzeczywistym. To przestrzeń wspólnej
              obecności, uważności i łagodnej pracy z ciałem, oddechem i umysłem
              - bez wychodzenia z domu.
            </p>
          </hgroup>
          <LiveLessonsGrid
            lessons={lessons}
            user={user}
          />
        </Container>
      </section>
    </>
  );
}
