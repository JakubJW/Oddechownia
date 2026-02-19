import Stripe from 'stripe';
import { env } from '@/env';

export const stripeClient = new Stripe(env.NEXT_STRIPE_API_SECRET, {
  apiVersion: '2025-08-27.basil',
});
