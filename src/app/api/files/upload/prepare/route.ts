import { db } from '@/server/db';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { files } from '@/server/db/schema';
import { env } from '@/env';
import z from 'zod';

const prepareUploadSchema = z.array(
  z.object({
    name: z.string(),
    type: z.string(),
    bucket: z.string(),
    folder: z.string(),
  })
);

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();

    const parsed = prepareUploadSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json('Bad request', { status: 400 });
    }

    const preparedFiles = parsed.data.map((upload) => {
      const extension = upload.name.split('.').pop();
      const hashedName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}.${extension}`;

      return {
        name: hashedName,
        originalName: upload.name,
        mimeType: upload.type,
        bucket: upload.bucket,
        path: `${upload.folder}/${hashedName}`,
      };
    });

    const preparedResult = await db
      .insert(files)
      .values(preparedFiles)
      .returning();

    const supabase = createAdminClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          persistSession: false,
        },
      }
    );

    const uploadInfoPromises = preparedResult.map(async (file) => {
      const { data, error } = await supabase.storage
        .from(file.bucket)
        .createSignedUploadUrl(file.path);

      if (error) {
        return {
          originalName: file.name,
          error: error.message,
          signedUrl: null,
          token: null,
          path: null,
        };
      }

      return {
        originalName: file.originalName,
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
