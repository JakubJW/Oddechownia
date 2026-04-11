import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { cn, formatTimeForInput } from '@/lib/utils';
import { Calendar, CircleCheck, Clock } from 'lucide-react';
import Container from '@/components/Container/Container';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { ACQUISITION_METHOD } from '@/entities/models/purchase';

type LiveLessonPurchaseSummaryProps = {
  purchasedAsGuest: boolean;
  lessonTitle: string;
  scheduledAt: string;
  image: string;
  duration: number;
  acquisitionMethod: ACQUISITION_METHOD;
};

const getCardTitle = (acquisitionMethod: ACQUISITION_METHOD) => {
  switch (acquisitionMethod) {
    case ACQUISITION_METHOD.FREE_PUBLIC:
    case ACQUISITION_METHOD.SUBSCRIPTION_BENEFIT:
    case ACQUISITION_METHOD.SUBSCRIPTION_QUOTA:
      return 'Zapis potwierdzony';
    case ACQUISITION_METHOD.PAYMENT:
      return 'Płatność potwierdzona';
    default:
      return;
  }
};

export const LiveLessonPurchaseSummary = ({
  purchasedAsGuest,
  lessonTitle,
  scheduledAt,
  image,
  duration,
  acquisitionMethod,
}: LiveLessonPurchaseSummaryProps) => {
  return (
    <section>
      <Container>
        <Card className="w-full max-w-md mx-auto rounded-xl">
          <CardHeader>
            <CardTitle>
              <span className="mr-2 inline-flex rounded-full bg-green-100  p-2">
                <CircleCheck className=" text-green-500 size-4" />
              </span>
              {getCardTitle(acquisitionMethod)}
            </CardTitle>
            <CardDescription>
              Twoje uczestnictwo w zajęciach zostało potwierdzone.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-8">
            <div>
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <Image
                  src={image || '/hero.jpg'}
                  alt="Obraz"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 left-2 space-y-1">
                  <Badge className="flex items-center gap-2 text-richBlack">
                    <Calendar className="size-4" />
                    <span className="text-xsm">
                      {new Date(scheduledAt).toLocaleDateString('pl-PL', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </Badge>
                  <Badge className="flex items-center gap-2 text-richBlack">
                    <Clock className="size-4" />
                    <span className="text-xs">
                      {`${formatTimeForInput(scheduledAt)} (${duration} min)`}
                    </span>
                  </Badge>
                </div>
              </div>
              <p className="text-richBlack font-semibold line-clamp-2 mt-4">
                {lessonTitle}
              </p>
            </div>
            <div>
              {purchasedAsGuest && (
                <>
                  <p>Co dalej?</p>
                  <ul className="mt-4 list-inside list-disc space-y-2">
                    <li className="list-item">
                      otrzymasz email z potwierdzeniem i szczegółami zajęć
                    </li>
                    <li className="list-item">
                      link do spotkania online zostanie wysłany 24h przed
                      zajęciami
                    </li>
                    <li className="list-item">
                      pamiętaj o przygotowaniu maty i wygodnej odzieży
                    </li>
                  </ul>
                </>
              )}
              <div className="mt-6 flex flex-col gap-4">
                {!purchasedAsGuest && (
                  <Link
                    className={cn(
                      buttonVariants(),
                      'bg-richBlack hover:bg-richBlack text-matcha-foreground'
                    )}
                    href="/moje-konto/zajecia-na-zywo"
                  >
                    Przejdź do moich zajęć
                  </Link>
                )}
                <Link
                  className={cn(
                    buttonVariants(),
                    'bg-matcha-foreground text-richBlack'
                  )}
                  href="/zajecia-na-zywo"
                >
                  Zobacz pozostałe zajęcia
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
};
