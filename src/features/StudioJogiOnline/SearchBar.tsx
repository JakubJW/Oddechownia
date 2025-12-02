import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';

type Props = { query: string; onQueryChange: (query: string) => void };

export const SearchBar = ({ onQueryChange }: Props) => {
  return (
    <div className="relative flex  max-w-lg px-4 mx-auto">
      <Input
        className="pr-12"
        placeholder="Wyszukaj..."
        onChange={(e) => onQueryChange(e.target.value)}
      />
      <SearchIcon className="size-4 absolute right-8 -translate-y-1/2 top-1/2" />
    </div>
  );
};
