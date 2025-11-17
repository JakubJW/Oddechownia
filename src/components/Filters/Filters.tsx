import SearchForm from './SearchForm';
import SortingSelect from './SortingSelect';
import {
  PlaylistSortOptions,
  LessonSortOptions,
} from '@/server/services/filters.service';

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

type FiltersOptions = {
  placeholder: string;
  name: 'status';
  options: [
    { label: 'Nadchodzące'; value: 'upcoming' },
    { label: 'Zakończone'; value: 'completed' }
  ];
}[];

type FiltersConfig = {
  search: boolean;
  sortOptions?: SortOptions[];
  filtersOptions?: FiltersOptions;
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
        {config.sortOptions &&
          config.sortOptions.map(({ placeholder, name, options }) => (
            <SortingSelect
              key={name}
              placeholder={placeholder}
              name={name}
              options={options}
            />
          ))}
        {config.filtersOptions &&
          config.filtersOptions.map(({ placeholder, name, options }) => (
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
