'use server';

import { createVideo } from '@/actions/video';
import Mux from '@mux/mux-node';
const mux = new Mux({
  tokenId: '9d984eac-f80d-4199-8687-118476e7fdb7',
  tokenSecret:
    'k6xsyPQecLZjf8HKRBVERqDsjISWcS3BQ/PAFMkMUUjXGlazZreIoohTXwu0pAOAYDOFph67xfY',
});
import { NextResponse } from 'next/server';

export async function GET() {
  const upload = await mux.video.uploads.create({
    cors_origin: 'https://localhost:3000',
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
