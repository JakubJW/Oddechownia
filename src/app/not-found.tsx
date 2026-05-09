import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-background via-accent/10 to-background">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="relative">
          <div className="text-[12rem] md:text-[16rem] font-bold text-matcha leading-none select-none">
            404
          </div>
        </div>

        <div className="space-y-4 -mt-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
            Weź głęboki oddech
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto leading-relaxed text-pretty">
            Ta strona chyba gdzieś powędrowała... Zaprowadzimy Cię do
            spokojniejszego miejsca.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link
            href="/"
            className={cn(buttonVariants(), 'gap-2')}
          >
            <Home className="w-4 h-4" />
            Strona główna
          </Link>
          <Link
            href="/studio-jogi-online"
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'gap-2 bg-transparent'
            )}
          >
            Studio jogi online
          </Link>
        </div>
      </div>
    </div>
  );
}
