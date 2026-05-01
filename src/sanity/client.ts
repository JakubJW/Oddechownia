import { createClient } from 'next-sanity';
import { env } from '@/env';

export const client = createClient({
  projectId: '8zxrrg66',
  dataset: env.NEXT_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
});
