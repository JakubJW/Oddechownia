export interface IStorageService {
  generateSignedUrl(
    bucket: string,
    path: string,
    ttl: number,
    download?: boolean
  ): Promise<string>;
}
