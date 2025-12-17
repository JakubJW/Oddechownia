import CaledarGrid from '@/features/user/Calendar/CalendarGrid';
import { getRequiredUser } from '@/lib/data';
import { SubscriptionInfoCard } from '@/features/user/SubscriptionInfoCard';
import { LessonsService } from '@/server/services/lessons.service';
import { LiveLessonsRegistrationsService } from '@/server/services/liveLessonsRegistrations.service';
import { RecentLessons } from '@/features/user/RecentLessons';
import { PostsService } from '@/server/services/posts.service';
import RecentPosts from '@/features/user/RecentPosts';
import { Wind } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function MyAccount() {
  const user = await getRequiredUser();
  const recentLessons = await LessonsService.getRecentlyWatchedLessons(user.id);
  const count = await LiveLessonsRegistrationsService.getUsedEntitlementsCount(
    user.id
  );
  const recentPosts = await PostsService.getRecentPosts();

  if (!user.hasActiveSubscription) {
    return redirect('/wymagana-subskrypcja');
  }

  return (
    <div className="grid grid-cols-12 gap-y-12 md:gap-x-12">
      <div className="col-span-12">
        <h1 className="text-xl font-light">
          Witaj ponownie, &nbsp;
          <span className="text-primary font-light">
            {user.firstName}
            <Wind
              className="size-6 inline ml-1"
              strokeWidth={1}
            />
          </span>
        </h1>
      </div>
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
