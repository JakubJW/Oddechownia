import { Grid } from '@/features/user/LiveLessons/Grid';

export default async function UserLiveLessons() {
  return (
    <div className="h-full">
      <p className="font-bold text-xl mb-4">Twoje zajęcia na żywo</p>
      <Grid />
    </div>
  );
}
