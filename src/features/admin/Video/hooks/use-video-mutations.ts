import { queryClient } from '@/components/QueryClientProvider';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useVideoMutations = () => {
  const deleteVideoAPI = async (id: string) => {
    const res = await fetch(`/api/admin/videos/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const errorBody = await res
        .json()
        .catch(() => ({ message: res.statusText }));

      throw new Error(errorBody.message || 'Unknown error');
    }

    const json = await res.json();
    return json.data as { success: boolean };
  };

  const deleteMutation = useMutation({
    mutationFn: deleteVideoAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
    onError: (error) => toast.error(error.message),
  });

  return {
    deleteMutation,
  };
};
