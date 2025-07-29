'use server';

import { createVideo } from '@/actions/video';
import { NextResponse } from 'next/server';
import { env } from '@/env';
import { muxService } from '@/services/mux';

export async function GET() {
  const { data: uploadData, success, error: uploadError } = await muxService.createUpload({
    cors_origin: env.NEXT_PUBLIC_APP_URL,
    new_asset_settings: {
      playback_policy: ['public', 'signed'],
    },
  });

  if (uploadError) {
    return NextResponse.json(
      { message: 'Video creation failed', uploadError },
      { status: 500 }
    );
  }

  const { data: videoData, error: videoError } = await createVideo({ uploadId: uploadData.id });

  if (videoError) {
    return NextResponse.json(
      { message: 'Video creation failed', videoError },
      { status: 500 }
    );
  }

  const result = { data: videoData, upload_url: uploadData.url };

  return NextResponse.json({ result }, { status: 200 });
}
