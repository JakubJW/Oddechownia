import { InferSelectModel } from 'drizzle-orm';
import { userFavoriteLessons } from '../db/schema';

export type UserFavoriteLessonsSchema = InferSelectModel<
  typeof userFavoriteLessons
>;
