import { IStorageService } from './interfaces/storage.service.interface';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/env';

export class SupabaseStorageService implements IStorageService {
  async generateSignedUrl(
    bucket: string,
    path: string,
    ttl: number
  ): Promise<string> {
    const supabase = createClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, ttl);

    console.log(data);

    if (error) {
      console.log(error);
      throw new Error('Cannot generate signed URL');
    }

    return data.signedUrl;
  }
}
