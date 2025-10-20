import { Params } from '@/types/types';
import { NextRequest, NextResponse } from 'next/server';
import { and, eq, desc, isNull, lt } from 'drizzle-orm';
import { attachments } from '@/server/db/schema';
import { db } from '@/server/db';
import { supabaseService, BUCKETS } from '@/server/services/supabase.service.';

const getQueryParams = (url: string) => {
  return Object.fromEntries(new URL(url).searchParams);
};

export async function GET(
  req: NextRequest,
  { params }: { params: Params<{ name: string }> }
) {
  try {
    const { name } = await params;

    const [attachment] = await db.query.attachments.findMany({
      where: eq(attachments.internalName, name),
    });

    const file = await supabaseService.downloadFile(
      attachment.internalName,
      BUCKETS.ATTACHMENTS,
      'documents'
    );

    return new NextResponse(file, {
      headers: {
        'Content-Type': file!.type,
        'Content-Disposition': `attachment; filename="${attachment.name}"`,
        'Content-Length': String(file?.size),
      },
      status: 200,
    });
  } catch (error) {
    console.error(
      'Podczas ładowania komentarzy wystąpił błąd. Spróbuj ponownie później.',
      error
    );

    return NextResponse.json({
      data: null,
      success: false,
      error:
        'Podczas ładowania komentarzy wystąpił błąd. Spróbuj ponownie później.',
    });
  }
}
