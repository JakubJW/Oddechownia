import { cn } from '@/lib/utils';

export interface ContainerProps extends React.PropsWithChildren<object> {
  className?: string;
}

export default function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn('container py-16', className ?? '')}>{children}</div>
  );
}
