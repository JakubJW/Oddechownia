'use server';

import { supabaseService, BUCKETS } from '@/services/supabase';
import { attachments } from '@/db/schema';
import { db } from '@/db';
import { inArray } from 'drizzle-orm';

export const createAttachment = async (lessonId: number, file: File) => {
  try {
    const {
      data: { url, internalName },
    } = await supabaseService.uploadFile(
      file,
      BUCKETS.ATTACHMENTS,
      'documents'
    );

    const [attachment] = await db
      .insert(attachments)
      .values({
        name: file.name,
        internalName,
        url,
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
    const fileNames = await db
      .select({ name: attachments.internalName })
      .from(attachments)
      .where(inArray(attachments.id, ids));

    const filePaths = fileNames.map(({ name }) => `documents/${name}`);
    console.log(filePaths);
    await supabaseService.deleteFile(BUCKETS.ATTACHMENTS, [...filePaths]);

    await db.delete(attachments).where(inArray(attachments.id, ids));

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
