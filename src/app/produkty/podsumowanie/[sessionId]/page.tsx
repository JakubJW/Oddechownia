import Container from '@/components/Container/Container';
import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Params } from '@/types/types';
import { CircleCheck, CircleX } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FulfillPurchaseUseCase } from '@/application/use-cases/product/fulfill-product-purchase.use-case';
import { PurchasesRepository } from '@/infrastructure/repositories/purchases.repository';
import { EbookPurchaseStrategy } from '@/infrastructure/strategies/ebook-purchase.strategy';
import { LiveLessonPurchaseStrategy } from '@/infrastructure/strategies/live-lesson-purchase.strategy';
import { stripeService } from '@/server/services/stripe.service';

export const metadata: Metadata = {
  title: 'Podsumowanie zakupu',
};

export default async function ProductPurchaseSummary({
  params,
}: {
  params: Params<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  if (!sessionId) {
    notFound();
  }

  try {
    const session = await stripeService.retrieveSession(sessionId);
    const useCase = new FulfillPurchaseUseCase(new PurchasesRepository(), [
      new EbookPurchaseStrategy(),
      new LiveLessonPurchaseStrategy(),
    ]);

    await useCase.execute({
      checkoutSessionId: session.id,
      stripePaymentStatus: session.payment_status,
      userEmail: session.customer_details!.email!,
      metadata: session.metadata!,
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
                {/* <p>{lessonTitle}</p>
                <span>
                  {new Intl.DateTimeFormat('pl-PL', {
                    timeZone: 'Europe/Warsaw',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }).format(new Date(scheduledAt))}
                </span> */}
              </div>
              <div className="border-t pt-6 mt-6 space-y-3 text-muted-foreground text-sm">
                <p className="font-medium">Co dalej?</p>
                <ul className="list-inside list-disc space-y-2">
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
  } catch (error) {
    console.error('Live Lesson Fulfillment Error:', error);

    return (
      <section>
        <Container>
          <Card className="max-w-lg">
            <CardHeader>
              <CardTitle>
                <span className="mr-2 inline-flex rounded-full bg-red-100  p-2">
                  <CircleX className=" text-red-500 h-4 w-4" />
                </span>
                Błąd weryfikacji płatności
              </CardTitle>
              <CardDescription>
                Podczas przetwarzania płatności wystąpił błąd. Jeśli środki
                zostały pobrane, skontaktuj się z nami podając ID sesji:
                <br />
                <code className="bg-gray-100 p-1 rounded text-xs mt-2 block w-fit">
                  {sessionId}
                </code>
              </CardDescription>
            </CardHeader>
            {/* <CardFooter>
              <Link
                className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
                href="/kontakt"
              >
                Kontakt z pomocą
              </Link>
            </CardFooter> */}
          </Card>
        </Container>
      </section>
    );
  }
}
