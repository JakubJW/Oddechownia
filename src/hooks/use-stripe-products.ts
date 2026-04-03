import { useQuery } from '@tanstack/react-query';

const stripeProductsAPI = async () => {
  try {
    const response = await fetch('/api/stripe/products', {
      method: 'GET',
    });

    return response.json() as unknown as {
      name: string;
      defaultPriceId: string;
      price: number;
      id: string;
    }[];
  } catch (error) {}
};

export const useStripeProducts = () => {
  return useQuery({
    queryFn: stripeProductsAPI,
    queryKey: ['stripe-products'],
  });
};
