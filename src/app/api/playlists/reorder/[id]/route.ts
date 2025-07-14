import { db } from '@/db';
import { playlists } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    await db
      .update(playlists)
      .set({
        position: body.position,
      })
      .where(eq(playlists.id, Number(id)));

    return NextResponse.json({ message: 'Success!' }, { status: 200 });
  } catch (error) {
    console.log(
      'Podczas zmiany pozycji playlisty wystąpił błąd. Spróbuj ponownie później.',
      error
    );
    return NextResponse.json(
      {
        message:
          'Podczas zmiany pozycji playlisty wystąpił błąd. Spróbuj ponownie później.',
      },
      { status: 500 }
    );
  }
}
