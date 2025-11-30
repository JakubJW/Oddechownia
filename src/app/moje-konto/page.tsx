import CaledarGrid from '@/features/user/Calendar/CalendarGrid';
import { getRequiredUser } from '@/lib/data';
import { SubscriptionInfoCard } from '@/features/user/SubscriptionInfoCard';
import { LessonsService } from '@/server/services/lessons.service';
import { LiveLessonsRegistrationsService } from '@/server/services/liveLessonsRegistrations.service';
import { NavigationButtons } from '@/features/user/NavigationButtons';
import { RecentLessons } from '@/features/user/RecentLessons';

export default async function MyAccount() {
  const user = await getRequiredUser();
  const recentLessons = await LessonsService.getRecentlyWatchedLessons(user.id);
  const count = await LiveLessonsRegistrationsService.getUsedEntitlementsCount(
    user.id
  );

  return (
    <div className="grid grid-cols-12 md:gap-12">
      <SubscriptionInfoCard
        subscriptionStatus={user.subscriptionStatus}
        stripeCustomerId={user.stripeCustomerId}
        liveLessonsUsageCount={count}
        className="col-span-12 md:col-span-6"
      />
      <RecentLessons
        lessons={recentLessons}
        className="col-span-12 md:col-span-6"
      />
      <CaledarGrid
        user={user}
        className="col-span-12  md:col-span-8"
      />
      <NavigationButtons className="col-span-12 md:col-span-4" />
    </div>
  );
}
