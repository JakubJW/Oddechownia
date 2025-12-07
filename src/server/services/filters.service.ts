import {
  SQL,
  eq,
  ilike,
  and,
  or,
  gte,
  lte,
  inArray,
  asc,
  desc,
  exists,
} from 'drizzle-orm';
import { PgTable, PgColumn } from 'drizzle-orm/pg-core';
import { playlists, lessons, videos, playlistLesson } from '@/server/db/schema';
import { db } from '@/server/db';

export type SortOrder = 'asc' | 'desc';
export type PlaylistSortOptions = 'name' | 'createdAt' | 'updatedAt';
export type LessonSortOptions = 'name' | 'createdAt' | 'updatedAt';

export interface BaseSortOptions {
  sortBy?: string;
  sortOrder?: SortOrder;
}

export interface BaseFilters extends BaseSortOptions {
  search?: string;
  id?: number | number[];
  slug?: string;
}

export interface PlaylistFilters extends BaseFilters {
  isPublished?: boolean;
  name?: string;
  lessonProps?: Omit<LessonFilters, 'playlistProps'>;
}

export interface PlaylistLessonFilters extends BaseFilters {
  isFeaturedOnHomepage?: boolean;
}

export interface LessonFilters extends BaseFilters {
  videoId?: number | number[];
  slug?: string;
  uploaded?: string;
  playlistProps?: Omit<PlaylistFilters, 'lessonProps'>;
  playlistLessonProps?: PlaylistLessonFilters;
}

export interface VideoFilters extends BaseFilters {
  durationMin?: number;
  durationMax?: number;
  status?: string | string[];
}

class FilterService {
  private filterMappers: Map<any, (filters: any) => SQL<unknown> | undefined> =
    new Map();
  private sortableColumns: Map<any, Record<string, PgColumn>> = new Map();

  constructor() {
    this.registerTableFilters();
    this.registerTableSortableColumns();
  }

  private registerTableFilters() {
    this.filterMappers.set(playlists, (filters: PlaylistFilters) => {
      const conditions: SQL<unknown>[] = [];

      if (filters.slug) {
        conditions.push(eq(playlists.slug, filters.slug));
      }

      if (filters.search) {
        const searchCondition = or(
          ilike(playlists.name, `%${filters.search}%`),
          ilike(playlists.description, `%${filters.search}%`)
        );

        if (searchCondition) {
          conditions.push(searchCondition);
        }
      }

      if (typeof filters.isPublished === 'boolean') {
        conditions.push(eq(playlists.isPublished, filters.isPublished));
      }

      return conditions.length ? and(...conditions) : undefined;
    });

    this.filterMappers.set(playlistLesson, (filters: PlaylistLessonFilters) => {
      const conditions: SQL<unknown>[] = [];

      // if (filters.isFeaturedOnHomepage) {
      //   conditions.push(
      //     eq(playlistLesson.isFeaturedOnHomepage, filters.isFeaturedOnHomepage)
      //   );
      // }

      if (filters.id) {
        if (Array.isArray(filters.id)) {
          conditions.push(inArray(playlistLesson.id, filters.id));
        } else {
          conditions.push(eq(playlistLesson.id, filters.id));
        }
      }

      return conditions.length ? and(...conditions) : undefined;
    });

    this.filterMappers.set(lessons, (filters: LessonFilters) => {
      const conditions: SQL<unknown>[] = [];

      if (filters.search) {
        const searchCondition = or(
          ilike(lessons.name, `%${filters.search}%`),
          ilike(lessons.description, `%${filters.search}%`)
        );

        if (searchCondition) {
          conditions.push(searchCondition);
        }
      }

      if (filters.id) {
        if (Array.isArray(filters.id)) {
          conditions.push(inArray(lessons.id, filters.id));
        } else {
          conditions.push(eq(lessons.id, filters.id));
        }
      }

      if (filters.slug) {
        conditions.push(eq(lessons.slug, filters.slug));
      }

      if (filters.playlistProps) {
        const playlistConditions: SQL<unknown>[] = [];

        if (typeof filters.playlistProps.isPublished === 'boolean') {
          playlistConditions.push(
            eq(playlists.isPublished, filters.playlistProps.isPublished)
          );
        }

        if (filters.playlistProps.search) {
          const searchCondition = or(
            ilike(playlists.name, `%${filters.search}%`),
            ilike(playlists.description, `%${filters.search}%`)
          );

          if (searchCondition) {
            conditions.push(searchCondition);
          }
        }

        if (playlistConditions.length > 0) {
          conditions.push(
            exists(
              db
                .select()
                .from(playlistLesson)
                .innerJoin(
                  playlists,
                  eq(playlistLesson.playlistId, playlists.id)
                )
                .where(
                  and(
                    eq(playlistLesson.lessonId, lessons.id),
                    ...playlistConditions
                  )
                )
            )
          );
        }
      }

      return conditions.length ? and(...conditions) : undefined;
    });

    this.filterMappers.set(videos, (filters: VideoFilters) => {
      const conditions: SQL<unknown>[] = [];

      if (filters.id) {
        if (Array.isArray(filters.id)) {
          conditions.push(inArray(videos.id, filters.id));
        } else {
          conditions.push(eq(videos.id, filters.id));
        }
      }

      if (typeof filters.durationMin === 'number') {
        conditions.push(gte(videos.duration, filters.durationMin));
      }
      if (typeof filters.durationMax === 'number') {
        conditions.push(lte(videos.duration, filters.durationMax));
      }

      if (filters.status) {
        if (Array.isArray(filters.status)) {
          conditions.push(inArray(videos.status, filters.status));
        } else {
          conditions.push(eq(videos.status, filters.status));
        }
      }

      return conditions.length ? and(...conditions) : undefined;
    });
  }

  private registerTableSortableColumns() {
    this.sortableColumns.set(playlists, {
      name: playlists.name,
      position: playlists.position,
      createdAt: playlists.createdAt,
      updatedAt: playlists.updatedAt,
    });

    this.sortableColumns.set(lessons, {
      name: lessons.name,
      description: lessons.description,
      createdAt: lessons.createdAt,
      updatedAt: lessons.updatedAt,
    });

    this.sortableColumns.set(videos, {
      id: videos.id,
      duration: videos.duration,
      status: videos.status,
    });
  }

  /**
   * Generates a Drizzle SQL condition for the given table and filters.
   * @param table The Drizzle table object (e.g., playlists, lessons).
   * @param filters The filter object specific to that table.
   * @returns A Drizzle SQL condition or undefined if no filters are applied.
   */
  public buildWhereCondition<T extends PgTable>(
    table: T,
    filters: any
  ): SQL<unknown> | undefined {
    const mapper = this.filterMappers.get(table);
    if (!mapper) {
      console.warn(`No filter mapper registered for table: ${table.getSQL()}`);
      return undefined;
    }

    if (!filters) return undefined;

    return mapper(filters);
  }

  /**
   * Generates a Drizzle ORDER BY clause for the given table and sort options.
   * @param table The Drizzle table object.
   * @param sortOptions The sort options (sortBy, sortOrder).
   * @returns An array of Drizzle SQL order expressions or undefined if no valid sort options.
   */
  public buildOrderByClause<T extends PgTable>(
    table: T,
    sortOptions: BaseSortOptions | undefined
  ): SQL<unknown>[] | undefined {
    if (!sortOptions) {
      return undefined;
    }

    const sortColumnName = sortOptions.sortBy;
    const sortOrder = sortOptions.sortOrder || 'asc';

    if (!sortColumnName) {
      return undefined;
    }

    const sortableCols = this.sortableColumns.get(table);
    if (!sortableCols || !sortableCols[sortColumnName]) {
      console.warn(
        `Attempted to sort by non-sortable or unknown column: ${table.getSQL()}.${sortColumnName}`
      );
      return undefined;
    }

    const column = sortableCols[sortColumnName];

    if (sortOrder === 'desc') {
      return [desc(column)];
    } else {
      return [asc(column)];
    }
  }
}

export const filterService = new FilterService();
