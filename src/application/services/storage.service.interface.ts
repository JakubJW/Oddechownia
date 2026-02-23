export interface IStorageService {
  generateSignedUrl(bucket: string, path: string, ttl: number): Promise<string>;
}
