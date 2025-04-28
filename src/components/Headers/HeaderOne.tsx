import { cn } from '@/lib/utils';
import { Montserrat } from 'next/font/google';

interface HeaderOneProps extends React.PropsWithChildren {
  className?: string;
}

const montserrat = Montserrat({ display: 'swap', subsets: ['latin'] });

export default function HeaderOne({ className, children }: HeaderOneProps) {
  return (
    <h1
      className={cn(
        'font-bold text-4xl leading-normal xl:text-5xl xl:leading-relaxed',
        className ?? '',
        montserrat.className
      )}
    >
      {children}
    </h1>
  );
}
