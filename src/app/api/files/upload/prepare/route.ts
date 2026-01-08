import { db } from '@/server/db';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { files } from '@/server/db/schema';
import { BUCKETS } from '@/server/services/supabase.service';
import { env } from '@/env';

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();

    const dataToInsert = json.map((entry) => {
      const extension = entry.name.split('.').pop();
      const hashedName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}.${extension}`;

      return {
        name: hashedName,
        originalName: entry.name,
        mimeType: entry.type,
        bucket: BUCKETS.PUBLIC_ASSETS,
        path: `thumbnails/live-lessons/${entry.name}`,
      };
    });

    const initialRows = await db.insert(files).values(dataToInsert).returning();

    const supabase = createAdminClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          persistSession: false,
        },
      }
    );

    const uploadInfoPromises = initialRows.map(async (row) => {
      const { data, error } = await supabase.storage
        .from(BUCKETS.PUBLIC_ASSETS)
        .createSignedUploadUrl(`thumbnails/live-lessons/${row.name}`);

      if (error) {
        return {
          originalName: row.name,
          error: error.message,
          signedUrl: null,
          token: null,
          path: null,
        };
      }

      return {
        originalName: row.originalName,
        error: null,
        signedUrl: data.signedUrl,
        token: data.token,
        path: data.path,
      };
    });

    const uploadInfos = await Promise.all(uploadInfoPromises);

    return NextResponse.json({ data: uploadInfos }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
