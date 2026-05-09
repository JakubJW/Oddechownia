import { GetClaimSummaryUseCase } from '@/application/use-cases/purchase/get-claim-summary.use-case';
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
import { Params } from '@/types/types';
import { CircleX } from 'lucide-react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Podsumowanie odbioru',
};

export default async function ProductClaimSummary({
  params,
}: {
  params: Params<{ purchaseId: string }>;
}) {
  const { purchaseId } = await params;

  if (!purchaseId) {
    notFound();
  }

  try {
    const summaryUseCase = new GetClaimSummaryUseCase(
      new PurchasesRepository(),
      new LiveLessonsRepository()
    );

    const summary = await summaryUseCase.execute(purchaseId);

    if (summary.productType === PRODUCT_TYPE.LIVE_LESSON) {
      return (
        <LiveLessonPurchaseSummary
          purchasedAsGuest={summary.purchasedAsGuest}
          acquisitionMethod={summary.acquisitionMethod}
          lessonTitle={summary.lessonData.title}
          scheduledAt={summary.lessonData.scheduledAt}
          image={summary.lessonData.image}
          duration={summary.lessonData.duration}
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
                zostały pobrane, skontaktuj się z nami podając ID zakupu:
                <br />
                <code className="bg-gray-100 p-1 rounded-sm text-xs mt-2 block w-fit">
                  {purchaseId}
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
