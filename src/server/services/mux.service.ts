import Mux from '@mux/mux-node';
import { env } from '@/env';
import { ActionResult } from '@/server/actions/types';

class MuxService {
  private static _instance: MuxService;
  private mux: Mux;

  private constructor() {
    const tokenSecret = env.NEXT_MUX_TOKEN_SECRET;
    const tokenId = env.NEXT_MUX_TOKEN_ID;
    const webhookSecret = env.NEXT_MUX_WEBHOOK_SECRET;

    this.mux = new Mux({
      tokenId,
      tokenSecret,
      webhookSecret,
    });
  }

  public static getInstance(): MuxService {
    if (!MuxService._instance) {
      MuxService._instance = new MuxService();
    }
    return MuxService._instance;
  }

  public async deleteAsset(assetId: string) {
    try {
      await this.mux.video.assets.delete(assetId);
    } catch (error) {}
  }

  public async createUpload(
    params: Mux.Video.UploadCreateParams
  ): Promise<ActionResult<Mux.Video.Uploads.Upload>> {
    try {
      const data = await this.mux.video.uploads.create(params);

      return { data, success: true, error: null };
    } catch (error) {
      console.error(
        'Podczas przesyłania filmu wystąpił błąd. Spróbuj ponownie później.',
        error
      );
      return {
        data: null,
        success: false,
        error:
          'Podczas przesyłania filmu wystąpił błąd. Spróbuj ponownie później.',
      };
    }
  }
}

export const muxService = MuxService.getInstance();
