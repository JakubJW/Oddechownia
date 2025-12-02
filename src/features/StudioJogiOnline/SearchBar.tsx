import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { SearchIcon } from 'lucide-react';

type Props = { query: string; onQueryChange: (query: string) => void };

export const SearchBar = ({ query, onQueryChange }: Props) => {
  return (
    <div className="max-w-lg px-4 mx-auto">
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput placeholder="Wyszukaj..." />
        <InputGroupAddon align="inline-end">
          <InputGroupButton>
            <SearchIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
};
