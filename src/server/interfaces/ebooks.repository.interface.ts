export interface IEbooksRepository {
  getEbookByProductId(productId: string): Promise<{ path: string } | undefined>;
}
