'use server';

import { db } from '@/db';
import { videos } from '@/db/schema';
import Mux from '@mux/mux-node';
const mux = new Mux({
  tokenId: '9d984eac-f80d-4199-8687-118476e7fdb7',
  tokenSecret:
    'k6xsyPQecLZjf8HKRBVERqDsjISWcS3BQ/PAFMkMUUjXGlazZreIoohTXwu0pAOAYDOFph67xfY',
});

export async function GET() {
  const upload = await mux.video.uploads.create({
    cors_origin: 'https://localhost:3000',
    new_asset_settings: {
      playback_policy: ['public', 'signed'],
    },
  });

  await db.insert(videos).values({
    uploadId: upload.id,
  });

  const data = { upload_id: upload.id, upload_url: upload.url };

  return new Response(JSON.stringify(data), { status: 200 });
}
