import { eq, sql } from 'drizzle-orm';
import { db } from '../db';
import { contentBlocks } from '../db/schema';

const updateFeaturedLessons = async (lessonIds: number[]) => {
  try {
    await db
      .update(contentBlocks)
      .set({
        content: sql`${contentBlocks.content} || ${JSON.stringify({ lessonIds })}::jsonb`,
      })
      .where(eq(contentBlocks.type, 'featured_lessons'));
  } catch (error) {
    console.error(error);
  }
};

const getFeaeturedLessonIds = async () => {
  try {
    const [result] = await db.query.contentBlocks.findMany({
      where: eq(contentBlocks.type, 'featured_lessons'),
    });

    return (result.content as { lessonIds: number[] }).lessonIds;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const ContentBlocksService = {
  updateFeaturedLessons,
  getFeaeturedLessonIds,
};
