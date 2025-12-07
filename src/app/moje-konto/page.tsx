import CaledarGrid from '@/features/user/Calendar/CalendarGrid';
import { getRequiredUser } from '@/lib/data';
import { SubscriptionInfoCard } from '@/features/user/SubscriptionInfoCard';
import { LessonsService } from '@/server/services/lessons.service';
import { LiveLessonsRegistrationsService } from '@/server/services/liveLessonsRegistrations.service';
import { RecentLessons } from '@/features/user/RecentLessons';
import { PostsService } from '@/server/services/posts.service';
import RecentPosts from '@/features/user/RecentPosts';

export default async function MyAccount() {
  const user = await getRequiredUser();
  const recentLessons = await LessonsService.getRecentlyWatchedLessons(user.id);
  const count = await LiveLessonsRegistrationsService.getUsedEntitlementsCount(
    user.id
  );
  const recentPosts = await PostsService.getRecentPosts();

  return (
    <div className="grid grid-cols-12 gap-y-12 md:gap-x-12">
      <RecentLessons
        lessons={recentLessons}
        className="col-span-12 lg:col-span-8"
      />
      <RecentPosts
        posts={recentPosts.filter((post) => post.id !== 10 && post.id !== 11)}
        className="col-span-12 lg:col-span-4"
      />
      <CaledarGrid
        user={user}
        className="col-span-12 lg:col-span-8"
      />
      <SubscriptionInfoCard
        subscription={user.subscription}
        stripeCustomerId={user.stripeCustomerId}
        liveLessonsUsageCount={count}
        userId={user.id}
        className="col-span-12 md:col-span-4"
      />
    </div>
  );
}
