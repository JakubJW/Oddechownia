export enum ACQUISITION_METHOD {
  PAYMENT = 'payment',
  SUBSCRIPTION_QUOTA = 'subscription_quota',
  SUBSCRIPTION_BENEFIT = 'subscription_benefit',
  FREE_PUBLIC = 'free_public',
}

export enum PURCHASE_STATE {
  CAN_CLAIM = 'can_claim',
  CLAIMED = 'claimed',
  CAN_PURCHASE = 'can_purchse',
  PURCHASED = 'purchased',
}

export type Purchase = {
  id: string;
  userId?: string;
  email: string;
  productId: string;
  checkoutSessionId?: string;
  acquisitionMethod: ACQUISITION_METHOD;
  createdAt: string;
};

export type PurchaseInsert = {
  email: string;
  productId: string;
  userId?: string;
  checkoutSessionId?: string;
  acquisitionMethod: ACQUISITION_METHOD;
};
