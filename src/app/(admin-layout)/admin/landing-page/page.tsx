import { db } from '@/server/db';
import { contentBlocks, lessons } from '@/server/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { FeaturedLessons } from '@/features/admin/landing-page/featured-lessons/choose-featured-lessons-grid';
import { supabaseService } from '@/server/services/supabase.service';
import { transformVideoToDto } from '@/server/services/videos.service';

const transform = (data: any) => {
  return data.map((lesson: any) => ({
    id: lesson.id,
    thumbnail: supabaseService.getFileUrl(
      lesson.thumbnail.name,
      lesson.thumbnail.bucket,
      lesson.thumbnail.path
    ).data,
    video: transformVideoToDto(lesson.video),
  }));
};

export default async function LandingPage() {
  const featuredLessons = await db.query.contentBlocks.findFirst({
    where: eq(contentBlocks.type, 'featured_lessons'),
  });

  if (!featuredLessons) {
    return 'Dodaj content block w bazie danych';
  }

  const result = await db.query.lessons.findMany({
    where: inArray(
      lessons.id,
      (featuredLessons.content as { lessonIds: number[] }).lessonIds
    ),
    with: {
      video: true,
      thumbnail: true,
    },
  });

  const allLessons = await db.query.lessons.findMany({
    with: {
      video: true,
      thumbnail: true,
    },
  });

  return (
    <FeaturedLessons
      initialLessons={transform(result)}
      allLessons={transform(allLessons)}
    />
  );
}
