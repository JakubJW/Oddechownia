import { FulfillPurchaseUseCase } from '@/application/use-cases/purchase/fulfill-purchase.use-case';
import { GetPurchaseSummaryUseCase } from '@/application/use-cases/purchase/get-purchase-summary.use-case';
import Container from '@/components/Container/Container';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PRODUCT_TYPE } from '@/entities/models/product';
import { EbookPurchaseSummary } from '@/features/products/purchase-summary/ebook-purchase-summary';
import { LiveLessonPurchaseSummary } from '@/features/products/purchase-summary/live-lesson-purchase-summary';
import { LiveLessonsRepository } from '@/infrastructure/repositories/live-lessons.repository';
import { PurchasesRepository } from '@/infrastructure/repositories/purchases.repository';
import { EbookPurchaseStrategy } from '@/infrastructure/strategies/ebook-purchase.strategy';
import { LiveLessonPurchaseStrategy } from '@/infrastructure/strategies/live-lesson-purchase.strategy';
import { stripeService } from '@/server/services/stripe.service';
import { Params } from '@/types/types';
import { CircleX } from 'lucide-react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

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
    const purchasesRepository = new PurchasesRepository();

    const useCase = new FulfillPurchaseUseCase(purchasesRepository, [
      new EbookPurchaseStrategy(),
      new LiveLessonPurchaseStrategy(
        new LiveLessonsRepository(),
        purchasesRepository
      ),
    ]);

    await useCase.execute({
      checkoutSessionId: session.id,
      stripePaymentStatus: session.payment_status,
      userEmail: session.customer_details!.email!,
      metadata: session.metadata!,
    });

    const summaryUseCase = new GetPurchaseSummaryUseCase(
      purchasesRepository,
      new LiveLessonsRepository()
    );

    const summary = await summaryUseCase.execute(sessionId);

    if (summary.productType === PRODUCT_TYPE.LIVE_LESSON) {
      return (
        <LiveLessonPurchaseSummary
          purchasedAsGuest={summary.purchasedAsGuest}
          lessonTitle={summary.lessonData.title}
          scheduledAt={summary.lessonData.scheduledAt}
          image={summary.lessonData.image}
          duration={summary.lessonData.duration}
          acquisitionMethod={summary.acquisitionMethod}
        />
      );
    } else {
      return <EbookPurchaseSummary />;
    }
  } catch (error) {
    console.error('Product purchase fulfillment error:', error);

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
