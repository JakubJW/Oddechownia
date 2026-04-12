'use client';

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
import { CircleCheck } from 'lucide-react';
import Link from 'next/link';

export const EbookPurchaseSummary = () => {
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
              Ebook jest już w drodze do Ciebie. Sprawdź skrzynkę mailową.
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
          </CardContent>
          <CardFooter className="flex gap-2">
            <Link
              className={cn(buttonVariants(), 'flex-1')}
              href="/produkty"
            >
              Zobacz pozostałe produkty
            </Link>
          </CardFooter>
        </Card>
      </Container>
    </section>
  );
};
