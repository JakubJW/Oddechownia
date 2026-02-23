import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useProductMutations = () => {
  const claimProductAPI = async (productId: string) => {
    const res = await fetch(`/api/products/${productId}/claim`, {
      method: 'POST',
    });

    if (!res.ok) {
      const errorBody = await res
        .json()
        .catch(() => ({ message: res.statusText }));

      throw new Error(
        `Failed to fetch comments (Status ${res.status}): ${
          errorBody.message || 'Unknown error'
        }`
      );
    }

    const json = await res.json();
    return json.data as { success: boolean };
  };

  const purchaseProductAPI = async (id: string) => {
    const res = await fetch(`/api/products/${id}/purchase`, {
      method: 'GET',
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
