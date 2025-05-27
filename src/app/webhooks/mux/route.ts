'use server';

import { env } from '@/../env';
import WEBHOOK_TYPES from '@/utils/webhooks/mux/types';
import Mux from '@mux/mux-node';
import get from 'lodash.get';
import { NextResponse } from 'next/server';
import { buffer } from '@/utils/requestBodyBufer';

const webhookSecret = env.NEXT_MUX_WEBHOOK_SECRET;
const mux = new Mux({ tokenId: env.NEXT_MUX_TOKEN_ID, tokenSecret: env.NEXT_MUX_TOKEN_SECRET });

export async function POST(req: Request) {
  const text = await req.text();
  const raw = await buffer(text).then((buffer) => buffer.toString('utf8'));

  if (!webhookSecret) {
    return NextResponse.json(
      { message: 'No webhook secret provided' },
      { status: 400 }
    );
  }

  try {
    mux.webhooks.verifySignature(raw, req.headers, webhookSecret);
  } catch (e) {
    console.error('Webhook signature verification failed', e);
    return NextResponse.json(
      { message: `Webhook error: ${(e as Error).message}` },
      {
        status: 400,
      }
    );
  }

  const json = JSON.parse(raw);
  const { data, type } = json;

  const WEBHOOK_TYPE_HANDLER = get(WEBHOOK_TYPES, type);
  if (!WEBHOOK_TYPE_HANDLER) {
    console.error('Webhook type handler not found');
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }

  try {
    await WEBHOOK_TYPE_HANDLER({ data });
    return NextResponse.json({ message: 'Success' }, { status: 200 });
  } catch (e) {
    if (e instanceof Error) {
      console.error(`Webhook Error: ${e.message}`);
      return NextResponse.json(
        { message: `Webhook Error: ${e.message}` },
        { status: 400 }
      );
    }

    console.error('Request error', e);
    return NextResponse.json({ message: 'Request error' }, { status: 500 });
  }
}
