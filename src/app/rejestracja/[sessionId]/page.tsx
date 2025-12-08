import Container from '@/components/Container/Container';
import { Params } from '@/types/types';
import { notFound, redirect } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { CircleX } from 'lucide-react';
import { AuthService } from '@/server/services/auth.service';

export const metadata = {
  title: 'Kończenie rejestracji | Oddechownia',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
  },
};

const SubscriptionCheckoutSuccess = async ({
  params,
}: {
  params: Params<{ sessionId: string }>;
}) => {
  const { sessionId } = await params;

  if (!sessionId) {
    notFound();
  }

  let isSuccess = false;

  try {
    await AuthService.fulfillSubscriptionPurchase(sessionId, {
      sendEmail: false,
    });
    isSuccess = true;
  } catch (error) {
    console.error('Fulfillment failed:', error);
  }

  if (isSuccess) {
    redirect('/moje-konto');
  }

  return (
    <section>
      <Container>
        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle>
              <span className="mr-2 inline-flex rounded-full bg-red-100  p-2">
                <CircleX className=" text-red-500 h-4 w-4" />
              </span>
              Błąd w trakcie przetwarzania{' '}
            </CardTitle>
            <CardDescription>
              Płatność mogła zostać przetworzona, ale wystąpił błąd przy
              aktywacji konta. Skontaktuj się z nami podając ID sesji: <br />
              {sessionId}
            </CardDescription>
          </CardHeader>
        </Card>
      </Container>
    </section>
  );
};

export default SubscriptionCheckoutSuccess;
