import HeaderTwo from '@/components/Headers/HeaderTwo';
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
        <hgroup className="text-center max-w-[800px] mx-auto space-y-6 mb-24">
          <HeaderTwo>Zajęcia na żywo online</HeaderTwo>
          <p className="text-xl">
            Dołącz do mnie na zajęciach z jogi na żywo! Praktykuj w czasie
            rzeczywistym z wygody swojego domu.
          </p>
        </hgroup>
        <Grid
          lessons={lessons}
          user={user}
        />
      </Container>
    </section>
  );
}
