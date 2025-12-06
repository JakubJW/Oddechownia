import { cn } from '@/lib/utils';

type Props = {
  author: string;
  isAdmin?: boolean;
};

export const Avatar = ({ author, isAdmin }: Props) => {
  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center w-8 h-8 bg-muted mr-2',
        isAdmin && 'bg-matcha-foreground'
      )}
    >
      <span className="text-sm font-light">
        {author.split(' ')[0].charAt(0)}
        {author.split(' ')[1].charAt(0)}
      </span>
    </div>
  );
};
