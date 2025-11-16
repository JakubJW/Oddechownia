import Filters from '@/components/Filters/Filters';
import { Grid } from '@/features/user/LiveLessons/Grid';

export default async function UserLiveLessons() {
  return (
    <div>
      <Filters
        config={{
          search: false,
          filtersOptions: [
            {
              placeholder: 'Filtry',
              name: 'status',
              options: [
                { label: 'Nadchodzące', value: 'upcoming' },
                { label: 'Zakończone', value: 'completed' },
              ],
            },
          ],
        }}
      />
      <Grid />
    </div>
  );
}
