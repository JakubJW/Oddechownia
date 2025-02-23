import { cn } from '@/lib/utils';

export interface HeaderTwoProps extends React.PropsWithChildren<object> {
  className?: string;
}

export default function HeaderTwo({ children, className }: HeaderTwoProps) {
  return (
    <h2
      className={cn(
        'font-bold text-2xl leading-normal xl:text-4xl xl:leading-relaxed',
        className ?? ''
      )}
    >
      {children}
    </h2>
  );
}
