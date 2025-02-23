import { cn } from '@/lib/utils';

export interface ContainerProps extends React.PropsWithChildren<object> {
  className?: string;
}

export default function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn('container mx-auto px-4 py-32', className ?? '')}>
      {children}
    </div>
  );
}
