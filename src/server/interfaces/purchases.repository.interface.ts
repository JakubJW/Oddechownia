export interface IPurchasesRepository {
  createPurchase(
    userId: string,
    productId: string,
    stripeSessionId?: string
  ): Promise<void>;

  hasUserPurchasedProduct(userId: string, productId: string): Promise<boolean>;
  getUserPurchasedProductIds(userId: string): Promise<string[]>;
}
