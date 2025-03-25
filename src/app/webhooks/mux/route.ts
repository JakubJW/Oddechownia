'use server';

import Mux from '@mux/mux-node';

import WEBHOOK_TYPES from '@/utils/webhooks/mux/types';
import get from 'lodash.get';

const webhookSecret = process.env.MUX_WEBHOOK_SECRET;
const mux = new Mux();

async function buffer(readable: string) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

function verifyWebhookSignature(rawBody: string, req: Request) {
  if (webhookSecret) {
    // this will raise an error if signature is not valid
    mux.webhooks.verifySignature(rawBody, req.headers, webhookSecret);
  } else {
    console.log(
      'Skipping webhook signature verification because no secret is configured'
    );
  }
  return true;
}

export async function POST(req: Request) {
  // First, attempt to verify the webhook
  const text = await req.text();
  const rawBody = await buffer(text).then((buf) => buf.toString('utf8'));

  try {
    verifyWebhookSignature(rawBody, req);
  } catch (e) {
    console.error(
      'Error verifyWebhookSignature - is the correct signature secret set?',
      e
    );
    return new Response(`Webhook Error: ${(e as Error).message}`, {
      status: 400,
    });
  }

  const jsonBody = JSON.parse(rawBody);
  const { data, type } = jsonBody;

  const WEBHOOK_TYPE_HANDLER = get(WEBHOOK_TYPES, type);

  if (WEBHOOK_TYPE_HANDLER) {
    try {
      await WEBHOOK_TYPE_HANDLER({ data });
      return new Response(`Success`, { status: 200 });
    } catch (err) {
      if (err instanceof Error) {
        console.log(`Webhook Error: ${err.message}`);
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
      }

      console.error('Request error', err);
      return new Response(`Request error`, { status: 500 });
    }
  } else {
    return new Response(`Success`, { status: 200 });
  }
}
