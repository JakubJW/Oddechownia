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
    : T[K] extends object
    ? NullToUndefined<T[K]>
    : T[K];
};

export type BasePost = typeof schema.posts.$inferSelect;
export type BasePlaylist = typeof schema.playlists.$inferSelect;
export type BaseLesson = typeof schema.lessons.$inferSelect;
export type BaseVideo = typeof schema.videos.$inferSelect;
export type BaseWaitlist = typeof schema.waitlist.$inferSelect;
export type BaseAttachment = typeof schema.attachments.$inferSelect;
export type BaseComment = typeof schema.comments.$inferSelect;
export type BaseUser = typeof schema.users.$inferSelect;
export type BaseUserSubscription = typeof schema.userSubscription.$inferSelect;
export type BaseFile = typeof schema.files.$inferSelect;

export type Lesson = BaseLesson & {
  video?: BaseVideo | null;
  attachments?: BaseAttachment[];
  playlists?: BasePlaylist[];
  thumbnail?: BaseFile;
};

export type PlaylistLesson = Omit<Lesson, 'playlists'> & {
  position: number;
  playlistLessonId: number;
};

export type Playlist = BasePlaylist & {
  video?: BaseVideo | null;
  lessons: PlaylistLesson[];
};

export type User = BaseUser & {
  subscriptions: BaseUserSubscription[];
};

export type Attachment = BaseAttachment & { file: BaseFile };

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
