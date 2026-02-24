export type SubscriberAccess = 'paid' | 'free_unlimited' | 'quota_based';

export type ProductType = 'live-lesson' | 'ebook';

export type Product = {
  id: string;
  name: string;
  slug: string;
  type: ProductType;
  description?: string;
  priceId: string;
  image: string;
  price: number;
  isVisible: boolean;
  subscriberAccess: SubscriberAccess;
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
