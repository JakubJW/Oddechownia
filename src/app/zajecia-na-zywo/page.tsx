import { HeaderTwo, HeadingParagraph } from '@/components/Headers/headers';
import Container from '@/components/Container/Container';
import { LiveLessonsService } from '@/server/services/liveLessons.service';
import { getUser } from '@/server/actions/user';
import { Grid } from '@/features/LiveLesson/Grid';

export default async function LiveLessons() {
  const user = await getUser();
  const lessons = await LiveLessonsService.getLiveLessonsWithUserStatus(user);

  return (
    <section>
      <Container className="overflow-hidden">
        <hgroup className="text-center max-w-3xl mx-auto space-y-6 mb-24">
          <HeaderTwo>Zajęcia na żywo online</HeaderTwo>
          <HeadingParagraph className="text-lg">
            Dołącz do mnie na spotkaniach na żywo (Zoom), podczas których
            praktykujemy razem w czasie rzeczywistym. To przestrzeń wspólnej
            obecności, uważności i łagodnej pracy z ciałem, oddechem i umysłem -
            bez wychodzenia z domu.
          </HeadingParagraph>
        </hgroup>
        <Grid
          lessons={lessons}
          user={user}
        />
      </Container>
    </section>
  );
}
