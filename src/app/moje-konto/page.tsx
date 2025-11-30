import CaledarGrid from '@/features/user/Calendar/CalendarGrid';
import { getRequiredUser } from '@/lib/data';
import { SubscriptionInfoCard } from '@/features/user/SubscriptionInfoCard/SubscriptionInfoCard';
import { LessonsService } from '@/server/services/lessons.service';
import LessonCard from '@/components/LessonCard/LessonCard';
import Link from 'next/link';
import { cn, formatDuration } from '@/lib/utils';
import Image from 'next/image';
import { LiveLessonsRegistrationsService } from '@/server/services/liveLessonsRegistrations.service';
import { buttonVariants } from '@/components/ui/button';
import { signOut } from '@/server/actions/auth';

export default async function MyAccount() {
  const user = await getRequiredUser();
  const recentLessons = await LessonsService.getRecentlyWatchedLessons(user.id);
  const count = await LiveLessonsRegistrationsService.getUsedEntitlementsCount(
    user.id
  );

  return (
    <div className="grid gap-16 grid-cols-12">
      {/* <div className="col-span-12 grid md:grid-cols-2 gap-6">
        <SubscriptionInfoCard
          subscriptionStatus={user.subscriptionStatus}
          stripeCustomerId={user.stripeCustomerId}
          liveLessonsUsageCount={count}
        />
        <div className="flex flex-col gap-4 md:w-1/2">
          <Link
            href="/moje-konto/ulubione-lekcje"
            className={cn(buttonVariants({ variant: 'secondary' }))}
          >
            Ulubione lekcje
          </Link>
          <Link
            href="/moje-konto/zajecia-na-zywo"
            className={cn(buttonVariants({ variant: 'secondary' }))}
          >
            Moje zajęcia na żywo
          </Link>
          <Link
            href="/moje-konto/ustawienia"
            className={cn(buttonVariants({ variant: 'secondary' }))}
          >
            Ustawienia konta
          </Link>
          <form
            action={signOut}
            className="inline-flex"
          >
            <button
              className={cn(buttonVariants({ variant: 'secondary' }), 'w-full')}
              type="submit"
            >
              Wyloguj
            </button>
          </form>
        </div>
      </div>
      <div className="col-span-12 md:col-span-4">
        <p className="mb-4 pl-4">Kontynuuj swoją praktykę</p>
        <div className="flex flex-col">
          {recentLessons.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/studio-jogi-online/${lesson.playlist.slug}/${lesson.slug}`}
            >
              <div className="lesson-playlist-card flex gap-4 p-4 rounded-lg relative transition-colors duration-300 hover:bg-primary-foreground">
                <div className="relative overflow-hidden rounded-lg flex-shrink-0">
                  <Image
                    src={lesson.thumbnail}
                    width={150}
                    height={96}
                    alt={lesson.name}
                    className="aspect-video transition-transform duration-300"
                  />
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs p-1 rounded-sm">
                    {formatDuration(lesson.video?.duration)}
                  </span>
                  <div
                    className={cn(
                      'absolute bottom-0 left-0 right-0 h-1 bg-gray-200/20 z-10'
                    )}
                  >
                    <div
                      className="h-full bg-emerald-200 transition-all duration-300 ease-out"
                      style={{ width: `${lesson.progress?.percent}%` }}
                    />
                  </div>
                </div>
                <p
                  title={lesson.name}
                  className="text-sm md:text-md font-light line-clamp-2 mb-auto"
                >
                  {lesson.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div> */}
      <div className="flex flex-col col-span-12 md:col-span-8">
        <CaledarGrid user={user} />
      </div>
    </div>
  );
}
