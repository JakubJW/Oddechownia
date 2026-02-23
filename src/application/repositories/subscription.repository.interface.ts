export interface ISubscriptionRepository {
  hasActiveSubscriptionAfterTrial(userId: string): Promise<boolean>;
}
