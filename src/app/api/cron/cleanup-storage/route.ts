import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { files, lessons, liveLessons, attachments } from '@/server/db/schema';
import { notInArray, isNotNull, inArray } from 'drizzle-orm';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/env';
import { headers } from 'next/headers';

export async function GET() {
  const h = await headers();
  const authorization = h.get('Authorization');
  if (authorization !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const lessonThumbnails = await db
      .select({ id: lessons.thumbnailId })
      .from(lessons)
      .where(isNotNull(lessons.thumbnailId));

    const liveLessonThumbnails = await db
      .select({ id: liveLessons.thumbnailId })
      .from(liveLessons)
      .where(isNotNull(liveLessons.thumbnailId));

    const attachmentFiles = await db
      .select({ id: attachments.fileId })
      .from(attachments)
      .where(isNotNull(attachments.fileId));

    const usedIds = [
      ...lessonThumbnails.map((t) => t.id),
      ...liveLessonThumbnails.map((t) => t.id).filter((val) => val !== null),
      ...attachmentFiles.map((t) => t.id),
    ];

    if (usedIds.length === 0) {
      usedIds.push(-1);
    }

    const orphans = await db
      .select()
      .from(files)
      .where(notInArray(files.id, usedIds))
      .limit(100);

    if (orphans.length === 0) {
      return NextResponse.json({ message: 'No orphans found' });
    }

    const supabase = createClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          persistSession: false,
        },
      }
    );

    const pathsToDelete = orphans.map((f) => f.path);

    const { error: storageError } = await supabase.storage
      .from('public-assets')
      .remove(pathsToDelete);

    if (storageError) {
      console.error('Storage delete failed', storageError);
      return NextResponse.json(
        { error: 'Storage delete failed' },
        { status: 500 }
      );
    }

    const orphanIds = orphans.map((f) => f.id);
    await db.delete(files).where(inArray(files.id, orphanIds));

    return NextResponse.json({
      success: true,
      deletedCount: orphanIds.length,
      deletedIds: orphanIds,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
