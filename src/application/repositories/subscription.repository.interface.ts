export interface ISubscriptionRepository {
  hasActiveSubscriptionAfterTrial(userId: string): Promise<boolean>;
  getSubscriptionStatus(userId: string): Promise<string>;
  getCurrentSubscriptionPeriod(
    userId: string
  ): Promise<{ start: string; end: string }>;
}
