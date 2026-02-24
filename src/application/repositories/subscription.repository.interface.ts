export interface ISubscriptionRepository {
  hasActiveSubscriptionAfterTrial(userId: string): Promise<boolean>;
  getSubscriptionStatus(userId: string): Promise<string>;
}
