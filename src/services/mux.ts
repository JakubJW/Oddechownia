import Mux from '@mux/mux-node';
import { env } from '@/env';

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

  public async createUpload(params: Mux.Video.UploadCreateParams) {
    try {
      const data = await this.mux.video.uploads.create(params);

      return { data, success: true, error: false };
    } catch (error) {
      return { data: null, success: false, error: error };
    }
  }
}

export const muxService = MuxService.getInstance();
