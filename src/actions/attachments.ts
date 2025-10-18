'use server';

import { BUCKETS } from '@/services/supabase';
import { attachments } from '@/db/schema';
import { db } from '@/db';
import { inArray } from 'drizzle-orm';
import { ActionResult } from './types';
import { BaseAttachment } from '@/db/types';
import { createFile, deleteFile } from './files';

export const createAttachment = async (
  lessonId: number,
  file: File
): Promise<ActionResult<BaseAttachment>> => {
  try {
    const {
      data: attachmentFile,
      success: createFileSuccess,
      error: createFileError,
    } = await createFile(file, BUCKETS.ATTACHMENTS, 'documents');

    if (!createFileSuccess) {
      return { data: null, success: false, error: createFileError };
    }

    const [attachment] = await db
      .insert(attachments)
      .values({
        fileId: attachmentFile.id,
        lessonId,
      })
      .returning();

    return { data: attachment, success: true, error: null };
  } catch (error) {
    console.error(
      'Nie udało się utworzyć załącznika. Spróbuj ponownie później.',
      error
    );

    return {
      data: null,
      success: false,
      error: 'Nie udało się utworzyć załącznika. Spróbuj ponownie później.',
    };
  }
};

export const deleteAttachment = async (ids: number[]) => {
  try {
    const fileNames = await db.query.attachments.findMany({
      columns: {},
      with: {
        file: true,
      },
      where: inArray(attachments.id, ids),
    });

    const fileIds = fileNames.map(({ file: { id } }) => id);

    await deleteFile(fileIds);

    return { data: null, success: true, error: null };
  } catch (error) {
    console.error(
      'Nie udało się usunąć załącznika. Spróbuj ponownie później.',
      error
    );
  }

  return {
    data: null,
    success: false,
    error: 'Nie udało się usunąć załącznika. Spróbuj ponownie później.',
  };
};
