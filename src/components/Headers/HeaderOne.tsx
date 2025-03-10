import { cn } from '@/lib/utils';

export interface HeaderOneProps extends React.PropsWithChildren {
  className?: string;
}

export default function HeaderOne({ className, children }: HeaderOneProps) {
  return (
    <h1
      className={cn(
        'font-bold text-4xl leading-normal xl:text-5xl xl:leading-relaxed',
        className
      )}
    >
      {children}
    </h1>
  );
}
