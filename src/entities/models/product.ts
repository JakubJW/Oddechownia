export enum SUBSCRIBER_ACCESS {
  PAID = 'paid',
  FREE_UNLIMITED = 'free_unlimited',
  QUOTA_BASED = 'quota_based',
}

export enum PRODUCT_TYPE {
  EBOOK = 'ebook',
  LIVE_LESSON = 'live-lesson',
}

export type Product = {
  id: string;
  name: string;
  slug: string;
  type: PRODUCT_TYPE;
  description?: string;
  priceId: string;
  image: string;
  price: number;
  isVisible: boolean;
  subscriberAccess: SUBSCRIBER_ACCESS;
};

export type EbookProduct = Product & {
  fileUrl: string;
};

export type LiveLessonProduct = Product & {
  scheduledAt: string;
  duration: number;
  isListed: boolean;
  isPublished: boolean;
  isCompleted: boolean;
  description?: string;
  meetingLink?: string;
  recordingUrl?: string;
};
