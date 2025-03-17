import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface PaginationProps {
  page?: string;
  perPage: number;
  total: number;
  baseUrl: string;
}

export default function Pagination({
  page,
  perPage,
  total,
  baseUrl,
}: PaginationProps) {
  const isActive = (index: number, page?: string) => {
    return (page === undefined && !index) || Number(page) === index + 1;
  };

  const buildUrl = (index: number) => {
    return `${baseUrl}?page=${index + 1}`;
  };

  return (
    <div className="inline-flex gap-4">
      {Array(Math.ceil(total / perPage))
        .fill(0)
        .map((item, index) => (
          <Link
            href={buildUrl(index)}
            key={index}
            className={cn(
              isActive(index, page)
                ? 'text-primaryBg bg-primaryFg'
                : 'text-primaryFg bg-primaryBg',
              'h-8 w-8 rounded-full relative'
            )}
          >
            <span className="leading-none absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
              {index + 1}
            </span>
          </Link>
        ))}
    </div>
  );
}
