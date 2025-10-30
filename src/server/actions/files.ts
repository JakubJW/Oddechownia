'use server';

import { supabaseService } from '@/server/services/supabase.service';
import { BUCKETS } from '@/server/services/supabase.service';
import { db } from '@/server/db';
import { files } from '@/server/db/schema';
import { ActionResult } from './types';
import { BaseFile } from '@/server/db/types';
import { inArray } from 'drizzle-orm';

export const createFile = async (
  file: File,
  bucket: BUCKETS,
  path: string
): Promise<ActionResult<BaseFile>> => {
  try {
    const {
      data: { name },
    } = await supabaseService.uploadFile(file, bucket, path);

    const [result] = await db
      .insert(files)
      .values({
        originalName: file.name,
        name,
        mimeType: file.type,
        path,
        bucket,
      })
      .returning();

    return { data: result, success: true, error: null };
  } catch (error) {
    console.error('Podczas przesyłania pliku wystąpił błąd.', error);

    return {
      data: null,
      success: false,
      error: 'Podczas przesyłania pliku wystąpił błąd.',
    };
  }
};

export const deleteFile = async (ids: number[]) => {
  try {
    const result = await db.query.files.findMany({
      columns: { id: true, bucket: true, path: true, name: true },
      where: inArray(files.id, ids),
    });

    for (let i = 0; i < result.length; i++) {
      await supabaseService.deleteFile(result[i].bucket, [
        `${result[i].path}/${result[i].name}`,
      ]);
    }

    await db.delete(files).where(inArray(files.id, ids));

    return { data: null, success: true, error: null };
  } catch (error) {
    console.error('Podczas usuwania plików wystąpił błąd.', error);
    return {
      data: null,
      success: false,
      error: 'Podczas usuwania plików wystąpił błąd.',
    };
  }
};
