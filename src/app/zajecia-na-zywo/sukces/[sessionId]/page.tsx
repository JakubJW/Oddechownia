import Container from '@/components/Container/Container';
import { Params } from '@/types/types';
import { stripeService } from '@/server/services/stripe.service';
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { LiveLessonsRegistrationsService } from '@/server/services/liveLessonsRegistrations.service';
import Link from 'next/link';
import { CircleCheck } from 'lucide-react';
import { db } from '@/server/db';
import { liveLessonsRegistrations } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const metadata = {
  title: 'Podsumowanie zakupu | Zajęcia na żywo | Oddechownia',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
  },
};

const LiveLessonCheckoutSuccess = async ({
  params,
}: {
  params: Params<{ sessionId: string }>;
}) => {
  const { sessionId } = await params;

  if (!sessionId) {
    notFound();
  }

  const registrationId =
    await LiveLessonsRegistrationsService.fullfillLiveLessonPurchase(sessionId);
  const registration = await db.query.liveLessonsRegistrations.findFirst({
    where: eq(liveLessonsRegistrations.id, registrationId),
    with: {
      lesson: {
        columns: { title: true, scheduledAt: true },
      },
    },
  });

  return (
    <section>
      <Container>
        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle>
              <span className="mr-2 inline-flex rounded-full bg-green-100  p-2">
                <CircleCheck className=" text-green-500 h-4 w-4" />
              </span>
              Płatność zakończona
            </CardTitle>
            <CardDescription>
              Twoje uczestnictwo w zajęciach zostało potwierdzone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md p-4">
              <p>{registration?.lesson.title}</p>
              <span>{registration?.lesson.scheduledAt}</span>
            </div>
            <div className="border-t pt-6 mt-6 space-y-3 text-muted-foreground text-sm">
              <p className='font-medium'>Co dalej?</p>
              <ul className='list-inside list-disc space-y-2'>
                <li className='list-item'>
                  otrzymasz email z potwierdzeniem i szczegółami zajęć
                </li>
                <li className='list-item'>
                  link do spotkania online zostanie wysłany 24h przed zajęciami
                </li>
                <li className='list-item'>
                  pamiętaj o przygotowaniu maty i wygodnej odzieży
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Link
              className={cn(buttonVariants({ variant: 'ghost' }), 'flex-1')}
              href="/zajecia-na-zywo"
            >
              Zobacz więcej zajęć
            </Link>
            <Link
              className={cn(buttonVariants({ variant: 'default' }), 'flex-1')}
              href="/moje-konto"
            >
              Przejdź do panelu
            </Link>
          </CardFooter>
        </Card>
      </Container>
    </section>
  );
};

export default LiveLessonCheckoutSuccess;
