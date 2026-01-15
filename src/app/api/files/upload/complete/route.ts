import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { inArray } from 'drizzle-orm';
import { files } from '@/server/db/schema';

export async function POST(req: NextRequest) {
  try {
    const { paths } = await req.json();

    if (!paths || paths.length === 0) {
      return NextResponse.json({ ids: [] });
    }

    const updatedRows = await db
      .update(files)
      .set({ uploadStatus: 'completed' })
      .where(inArray(files.path, paths))
      .returning({ id: files.id });

    const ids = updatedRows.map((row) => row.id);

    return NextResponse.json({ ids });
  } catch (error) {
    console.error('Failed to complete upload:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
