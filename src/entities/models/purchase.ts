export type AcquisitionMethod =
  | 'payment'
  | 'subscription_quota'
  | 'subscription_benefit'
  | 'free_public';

export type Purchase = {
  id: string;
  userId?: string;
  email: string;
  productId: string;
  checkoutSessionId?: string;
  acquisitionMethod: AcquisitionMethod;
};

export type PurchaseInsert = {
  email: string;
  productId: string;
  userId?: string;
  checkoutSessionId?: string;
  acquisitionMethod: AcquisitionMethod;
};
