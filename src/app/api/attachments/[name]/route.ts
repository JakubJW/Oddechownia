import { Params } from '@/types/types';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseService, BUCKETS } from '@/server/services/supabase.service';
import { AttachmentsService } from '@/server/services/attachments.service';

export async function GET(
  req: NextRequest,
  { params }: { params: Params<{ name: string }> }
) {
  try {
    const { name } = await params;

    const [attachment] = await AttachmentsService.getAttachmentsByName(name);

    const file = await supabaseService.downloadFile(
      attachment.name,
      BUCKETS.ATTACHMENTS,
      'documents'
    );

    return new NextResponse(file, {
      headers: {
        'Content-Type': file!.type,
        'Content-Disposition': `attachment; filename="${attachment.originalName}"`,
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
