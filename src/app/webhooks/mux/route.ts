'use server';

import { env } from '@/env';
import Mux from '@mux/mux-node';
import { NextResponse } from 'next/server';
import { buffer } from '@/utils/requestBodyBufer';
import { headers } from 'next/headers';
import { db } from '@/server/db';
import { videos } from '@/server/db/schema';
import { not, eq, and } from 'drizzle-orm';

const mux = new Mux({
  tokenId: env.NEXT_MUX_TOKEN_ID,
  tokenSecret: env.NEXT_MUX_TOKEN_SECRET,
  webhookSecret: env.NEXT_MUX_WEBHOOK_SECRET,
});

export async function POST(req: Request) {
  const body = await req.text();
  const headerList = await headers();
  const raw = await buffer(body).then((buffer) => buffer.toString('utf8'));

  try {
    mux.webhooks.verifySignature(raw, req.headers);
  } catch (e) {
    console.error('Webhook signature verification failed', e);
    return NextResponse.json(
      { message: 'Webhook signature verification failed' },
      {
        status: 400,
      }
    );
  }

  const event = mux.webhooks.unwrap(body, headerList);

  try {
    switch (event.type) {
      case 'video.asset.created': {
        const { upload_id, playback_ids, status } = event.data;

        if (!upload_id || !playback_ids) {
          return NextResponse.json({ message: '' }, { status: 400 });
        }

        const publicPlaybackRow = playback_ids.find(
          (row) => row.policy === 'public'
        );
        if (!publicPlaybackRow) {
          return NextResponse.json(
            { message: 'Public playback id missing' },
            { status: 400 }
          );
        }

        const privatePlaybackRow = playback_ids.find(
          (row) => row.policy === 'signed'
        );
        if (!privatePlaybackRow) {
          return NextResponse.json(
            { message: 'Private playback id missing' },
            { status: 400 }
          );
        }

        await db
          .update(videos)
          .set({
            publicPlaybackId: publicPlaybackRow.id,
            privatePlaybackId: privatePlaybackRow.id,
            status,
          })
          .where(
            and(eq(videos.uploadId, upload_id), not(eq(videos.status, 'ready')))
          );
        return NextResponse.json(
          { message: 'Asset created handled successfully' },
          { status: 200 }
        );
      }
      case 'video.asset.ready': {
        const { upload_id, playback_ids, status, duration, aspect_ratio } =
          event.data;

        if (!upload_id || !playback_ids || !duration) {
          return NextResponse.json({ message: '' }, { status: 400 });
        }
        const publicPlaybackRow = playback_ids.find(
          (row) => row.policy === 'public'
        );
        if (!publicPlaybackRow) {
          return NextResponse.json(
            { message: 'Public playback id missing' },
            { status: 400 }
          );
        }

        const privatePlaybackRow = playback_ids.find(
          (row) => row.policy === 'signed'
        );
        if (!privatePlaybackRow) {
          return NextResponse.json(
            { message: 'Private playback id missing' },
            { status: 400 }
          );
        }

        await db
          .update(videos)
          .set({
            publicPlaybackId: publicPlaybackRow.id,
            privatePlaybackId: privatePlaybackRow.id,
            duration: Math.round(duration),
            aspectRatio: aspect_ratio,
            status,
          })
          .where(eq(videos.uploadId, upload_id));
        return NextResponse.json(
          { message: 'Asset ready handled successfully' },
          { status: 200 }
        );
      }
      case 'video.asset.deleted':
        {
          const { upload_id } = event.data;
          if (!upload_id) {
            return NextResponse.json({ message: '' }, { status: 400 });
          }

          await db.delete(videos).where(eq(videos.uploadId, upload_id));
        }
        return NextResponse.json(
          { message: 'Asset deleted successfully' },
          { status: 200 }
        );
      default:
        return NextResponse.json({ message: 'Success' }, { status: 200 });
    }
  } catch (e) {
    console.error('Request error', e);
    return NextResponse.json({ message: 'Request error' }, { status: 500 });
  }
}
