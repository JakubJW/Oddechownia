'use server';

import { createVideo } from '@/actions/video';
import Mux from '@mux/mux-node';
import { NextResponse } from 'next/server';
import { env } from '../../../../../env';

const mux = new Mux({
  tokenId: env.NEXT_MUX_TOKEN_ID,
  tokenSecret: env.NEXT_MUX_TOKEN_SECRET,
});

export async function GET() {
  const upload = await mux.video.uploads.create({
    cors_origin: env.NEXT_PUBLIC_APP_URL,
    new_asset_settings: {
      playback_policy: ['public', 'signed'],
    },
  });

  const { error } = await createVideo({ uploadId: upload.id });

  if (error) {
    return NextResponse.json(
      { message: 'Video creation failed' },
      { status: 500 }
    );
  }

  const data = { upload_id: upload.id, upload_url: upload.url };

  return NextResponse.json({ data }, { status: 200 });
}
