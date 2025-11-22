import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-accent/10 to-background">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="relative">
          <div className="text-[12rem] md:text-[16rem] font-bold text-matcha leading-none select-none">
            404
          </div>
          {/* <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-steelBlue animate-[ping_3s_ease-in-out_infinite]" />
          </div> */}
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

        {/* <div className="pt-12 text-sm text-muted-foreground space-y-2">
          <p className="font-medium">You might be looking for:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link
              href="/"
              className="px-3 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="px-3 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="px-3 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div> */}
      </div>
    </div>
  );
}
