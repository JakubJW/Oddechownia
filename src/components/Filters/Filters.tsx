import SearchForm from './SearchForm';
import SortingSelect from './SortingSelect';
import { PlaylistSortOptions, LessonSortOptions } from '@/services/filters';

type SortDirection = 'asc' | 'desc';
type SortByName = 'sortBy';
type SortOrderName = 'sortOrder';
type SortOption<TValue extends string> = {
  label: string;
  value: TValue;
};

type SortOptions =
  | {
      placeholder: string;
      name: SortByName;
      options: SortOption<PlaylistSortOptions | LessonSortOptions>[];
    }
  | {
      placeholder: string;
      name: SortOrderName;
      options: SortOption<SortDirection>[];
    };

type FiltersConfig = {
  search: boolean;
  sortOptions: SortOptions[];
};

export default function Filters({
  children,
  config,
}: {
  children?: React.ReactNode;
  config: FiltersConfig;
}) {
  return (
    <div className="flex justify-end gap-2">
      {config.search && <SearchForm />}
      <form className="flex gap-2">
        {config.sortOptions.map(({ placeholder, name, options }) => (
          <SortingSelect
            key={name}
            placeholder={placeholder}
            name={name}
            options={options}
          />
        ))}
      </form>
      {children}
    </div>
  );
}
