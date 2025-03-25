import * as schema from './schema';
import * as relations from './relations';

import type {
  BuildQueryResult,
  DBQueryConfig,
  ExtractTablesWithRelations,
} from 'drizzle-orm';

type Schema = typeof schema & typeof relations;
type TSchema = ExtractTablesWithRelations<Schema>;

export type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
  'one' | 'many',
  boolean,
  TSchema,
  TSchema[TableName]
>['with'];

export type InferResultType<
  TableName extends keyof TSchema,
  With extends IncludeRelation<TableName> | undefined = undefined
> = BuildQueryResult<
  TSchema,
  TSchema[TableName],
  {
    with: With;
  }
>;

type NullToUndefined<T> = {
  [K in keyof T]: T[K] extends null
    ? undefined
    : T[K] extends (infer U)[]
    ? NullToUndefined<U>[]
    : Exclude<T[K], null> | ([null] extends [T[K]] ? undefined : never);
};

export type Course = typeof schema.courses.$inferSelect;
export type Lesson = typeof schema.lessons.$inferSelect;
export type Video = typeof schema.videos.$inferSelect;
export type Post = typeof schema.posts.$inferSelect;

export type CourseWithLessons = NullToUndefined<
  InferResultType<'courses', { lessons: true }>
>;
export type CourseWithLessonsWithVideos = NullToUndefined<
  InferResultType<'courses', { lessons: true }>
>;
export type LessonWithVideos = NullToUndefined<
  InferResultType<'lessons', { videos: true }>
>;

export function mapNullsToUndefined<T>(obj: T): NullToUndefined<T> | undefined {
  if (obj === null) return undefined;
  if (Array.isArray(obj))
    return obj.map(mapNullsToUndefined) as NullToUndefined<T>;
  if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        mapNullsToUndefined(value),
      ])
    ) as NullToUndefined<T>;
  }
  return obj as NullToUndefined<T> | undefined;
}
