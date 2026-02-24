export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  regulationsAgreement: boolean;
  privacyPolicyAgreement: boolean;
  role: string;
  stripeCustomerId?: string;
};
