import Stripe from 'stripe';
import { env } from '@/env';

export const stripe = new Stripe(env.NEXT_STRIPE_API_SECRET, {
  apiVersion: '2025-04-30.basil',
});
