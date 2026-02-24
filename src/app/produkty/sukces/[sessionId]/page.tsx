import Container from '@/components/Container/Container';
import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Params } from '@/types/types';
import { CircleCheck } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Podsumowanie zakupu | Zajęcia na żywo',
};

const EbookCheckoutSuccess = async ({
  params,
}: {
  params: Params<{ sessionId: string }>;
}) => {
  const { sessionId } = await params;

  if (!sessionId) {
    notFound();
  }

  return (
    <section>
      <Container>
        <Card className="mx-auto max-w-lg">
          <CardHeader>
            <CardTitle>
              <span className="mr-2 inline-flex rounded-full bg-green-100  p-2">
                <CircleCheck className=" text-green-500 h-4 w-4" />
              </span>
              Płatność zakończona
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-t pt-6 space-y-3 text-muted-foreground text-sm">
              <p className="font-medium">
                Otrzymasz email z linkiem do pobrania ebooka.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Link
              className={cn(buttonVariants({ variant: 'default' }), 'flex-1')}
              href="/"
            >
              Strona główna
            </Link>
            <Link
              className={cn(buttonVariants({ variant: 'secondary' }), 'flex-1')}
              href="/produkty"
            >
              Przeglądaj produkty
            </Link>
          </CardFooter>
        </Card>
      </Container>
    </section>
  );
};

export default EbookCheckoutSuccess;
