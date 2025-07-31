import * as schema from './schema';
import * as relations from './relations';

import type {
  BuildQueryResult,
  DBQueryConfig,
  ExtractTablesWithRelations,
} from 'drizzle-orm';
import { getCourses } from '@/actions/course';

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
    : T[K] extends object
    ? NullToUndefined<T[K]>
    : T[K];
};

export type Post = typeof schema.posts.$inferSelect;
export type Course = typeof schema.courses.$inferSelect;
export type Playlist = typeof schema.playlists.$inferSelect;
export type Lesson = typeof schema.lessons.$inferSelect;
export type Video = typeof schema.videos.$inferSelect;

export type LessonWithVideo = Lesson & {
  video: Video | null;
};
export type LessonWithPlaylists = Lesson & {
  playlists: Playlist[];
};
export type LessonWithPlaylistsWithVideo = Lesson & {
  playlists: Playlist[];
  video: Video | null;
};
export type PlaylistWithLessons = Playlist & {
  lessons: Lesson[];
};
export type PlaylistWithLessonsWithVideo = Playlist & {
  lessons: LessonWithVideo[];
};
export type Waitlist = typeof schema.waitlist.$inferSelect;

export type CourseWithLessons = NullToUndefined<
  InferResultType<'courses', { lessons: true }>
>;
export type CourseWithLessonsWithVideos = Awaited<
  ReturnType<typeof getCourses>
>;

export function nullToUndefined<T>(data: T): NullToUndefined<T> {
  if (Array.isArray(data)) {
    return data.map(nullToUndefined) as NullToUndefined<T>;
  }
  if (data !== null && typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        value === null ? undefined : nullToUndefined(value),
      ])
    ) as NullToUndefined<T>;
  }

  return data as NullToUndefined<T>;
}
