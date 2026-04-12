import { LiveLessonSignUpValues } from '@/features/LiveLesson/Form/schema';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useProductMutations = () => {
  const claimProductAPI = async ({
    productId,
    values,
  }: {
    productId: string;
    values?: LiveLessonSignUpValues;
  }) => {
    const res = await fetch(`/api/products/${productId}/claim`, {
      method: 'POST',
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: res.statusText }));

      throw new Error(error || 'Unknown error');
    }

    const json = await res.json();
    return json;
  };

  const purchaseProductAPI = async ({
    productId,
    values,
  }: {
    productId: string;
    values?: LiveLessonSignUpValues;
  }) => {
    const res = await fetch(`/api/products/${productId}/purchase`, {
      method: 'POST',
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const errorBody = await res
        .json()
        .catch(() => ({ message: res.statusText }));

      throw new Error(errorBody.message || 'Unknown error');
    }

    const json = await res.json();
    return json as { url: string };
  };

  const claimMutation = useMutation({
    mutationFn: claimProductAPI,
    onSuccess: () => {},
    onError: (error) => toast.error(error.message),
  });

  const purchaseMutation = useMutation({
    mutationFn: purchaseProductAPI,
    onSuccess: ({ url }) => (window.location.href = url),
    onError: (error) => toast.error(error.message),
  });

  return {
    claimMutation,
    purchaseMutation,
  };
};
