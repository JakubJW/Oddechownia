import Mux from '@mux/mux-node';
import { env } from '@/env';

export const mux = new Mux({
  tokenId: env.NEXT_MUX_TOKEN_ID,
  tokenSecret: env.NEXT_MUX_TOKEN_SECRET,
});

export async function signMuxPlaybackId(playbackId: string) {
  const base64Secret = env.NEXT_MUX_SIGNING_KEY_SECRET;
  const privateKey = Buffer.from(base64Secret, 'base64');

  const token = await mux.jwt.signPlaybackId(playbackId, {
    keyId: env.NEXT_MUX_SIGNING_KEY_ID,
    keySecret: privateKey as unknown as string,
    expiration: '24h',
  });

  return token;
}
