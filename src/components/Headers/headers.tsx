import { cn } from '@/lib/utils';
import { Montserrat } from 'next/font/google';

type Props = {
  children: React.ReactNode;
  className?: string;
};

const montserrat = Montserrat({ display: 'swap', subsets: ['latin'] });

export const HeaderOne = ({ className, children }: Props) => {
  return (
    <h1
      className={cn(
        'font-medium text-4xl leading-normal xl:text-5xl xl:leading-snug',
        className ?? '',
        montserrat.className
      )}
    >
      {children}
    </h1>
  );
};

export const HeaderTwo = ({ children, className }: Props) => {
  return (
    <h2
      className={cn(
        'text-2xl leading-normal xl:text-4xl xl:leading-relaxed',
        className ?? '',
        montserrat.className
      )}
    >
      {children}
    </h2>
  );
};

export const HeadingParagraph = ({ children, className }: Props) => {
  return (
    <p
      className={cn(
        'leading-relaxed text-xl font-light',
        className ?? '',
        montserrat.className
      )}
    >
      {children}
    </p>
  );
};
