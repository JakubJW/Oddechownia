import { cn } from '@/lib/utils';
import { Montserrat } from 'next/font/google';
interface HeaderTwoProps extends React.PropsWithChildren {
  className?: string;
}

const montserrat = Montserrat({ display: 'swap', subsets: ['latin'] });

export default function HeaderTwo({ children, className }: HeaderTwoProps) {
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
}
