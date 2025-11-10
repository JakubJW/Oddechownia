import HeaderTwo from '@/components/Headers/HeaderTwo';
import Container from '@/components/Container/Container';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LiveLessonsService } from '@/server/services/liveLessons.service';
import { formatTimeForInput } from '@/lib/utils';

export default async function LiveLessons() {
  const lessons = await LiveLessonsService.getManyForLiveLessonsPage();

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-10">
          {lessons.map((lesson) => (
            <Card key={lesson.id}>
              <CardHeader>
                <CardTitle>{lesson.title}</CardTitle>
                <div className="flex flex-col gap-1 items-end">
                  {/* {isRegistered && (
                      <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
                        Zapisany
                      </Badge>
                    )}
                    {isPending && <Badge variant="outline">Oczekuje</Badge>} */}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      {new Date(lesson.scheduledAt).toLocaleDateString(
                        'pl-PL',
                        {
                          month: 'short',
                          day: 'numeric',
                        }
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">
                      {formatTimeForInput(lesson.scheduledAt)} (
                      {lesson.duration} min)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
