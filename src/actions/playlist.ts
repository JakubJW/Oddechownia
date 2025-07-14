'use server';

import { createSlug } from '@/lib/utils';
import { db } from '@/db';
import { eq, asc, desc } from 'drizzle-orm';
import { playlists } from '@/db/schema';
import { ActionResult } from './types';
import { Playlist } from '@/db/types';

interface ICreatePlaylist {
  name: string;
  description: string;
  isPublished: boolean;
}

// 17:28 przerwa

export const createPlaylist = async ({
  name,
  description,
  isPublished,
}: ICreatePlaylist): Promise<ActionResult<Playlist>> => {
  try {
    const [lastPlaylist] = await db
      .select()
      .from(playlists)
      .orderBy(desc(playlists.position))
      .limit(1);

    const [playlist] = await db
      .insert(playlists)
      .values({
        name,
        description,
        isPublished,
        slug: createSlug(name),
        position: lastPlaylist ? lastPlaylist.position * 2 : 1024,
      })
      .returning();

    return { data: playlist, success: true, error: null };
  } catch (e) {
    console.error('Podczas tworzenia playlisty wystąpił błąd.', e);
    return {
      data: null,
      success: false,
      error:
        'Podczas tworzenia playlisty wystąpił błąd. Spróbuj ponownie później',
    };
  }
};

export const updatePlaylist = async (
  slug: string,
  payload: ICreatePlaylist
): Promise<ActionResult<Playlist>> => {
  try {
    const [data] = await db
      .update(playlists)
      .set({
        ...payload,
      })
      .where(eq(playlists.slug, slug))
      .returning();

    return { data, success: true, error: null };
  } catch (error) {
    console.error(
      'Podczas edytowania playlisty wystąpił błąd. Spróbuj ponownie później.',
      error
    );
    return {
      data: null,
      success: false,
      error:
        'Podczas edytowania playlisty wystąpił błąd. Spróbuj ponownie później.',
    };
  }
};

export const getPublishedPlaylists = async (): Promise<
  ActionResult<Playlist[]>
> => {
  try {
    const data = await db
      .select()
      .from(playlists)
      .where(eq(playlists.isPublished, true))
      .orderBy(asc(playlists.position));

    return { data, success: true, error: null };
  } catch (error) {
    console.error(
      'Podczas pobierania playlist wystąpił błąd. Spróbuj ponownie później.',
      error
    );
    return {
      data: null,
      success: false,
      error:
        'Podczas pobierania playlist wystąpił błąd. Spróbuj ponownie później.',
    };
  }
};

export const getPlaylists = async (): Promise<ActionResult<Playlist[]>> => {
  try {
    const data = await db
      .select()
      .from(playlists)
      .orderBy(asc(playlists.position));

    return { data, success: true, error: null };
  } catch (error) {
    console.error(
      'Podczas pobierania playlist wystąpił błąd. Spróbuj ponownie później.',
      error
    );
    return {
      data: null,
      success: false,
      error:
        'Podczas pobierania playlist wystąpił błąd. Spróbuj ponownie później.',
    };
  }
};

export const getPlaylistBySlug = async (
  slug: string
): Promise<ActionResult<Playlist>> => {
  try {
    const [data] = await db
      .select()
      .from(playlists)
      .where(eq(playlists.slug, slug));

    return { data, success: true, error: null };
  } catch (error) {
    console.error(
      'Podczas pobierania playlisty wystąpił błąd. Spróbuj ponownie później.',
      error
    );
    return {
      data: null,
      success: false,
      error:
        'Podczas pobierania playlisty wystąpił błąd. Spróbuj ponownie później.',
    };
  }
};
