import { queryClient } from '@/components/QueryClientProvider';
import { CreatePostValues } from '../createPostFormSchema';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

export const usePostMutations = () => {
  const createPostAPI = async (values: CreatePostValues) => {
    const res = await fetch(`/api/posts`, {
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
    return json;
  };

  const updatePostAPI = async ({
    id,
    values,
  }: {
    id: number;
    values: CreatePostValues;
  }) => {
    const res = await fetch(`/api/posts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const errorBody = await res
        .json()
        .catch(() => ({ message: res.statusText }));

      throw new Error(errorBody.message || 'Unknown error');
    }

    const json = await res.json();
    return json;
  };

  const deletePostAPI = async (id: number) => {
    const res = await fetch(`/api/posts/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const errorBody = await res
        .json()
        .catch(() => ({ message: res.statusText }));

      throw new Error(errorBody.message || 'Unknown error');
    }

    const json = await res.json();
    return json;
  };

  const createMutation = useMutation<
    { message: string },
    Error,
    CreatePostValues
  >({
    mutationFn: createPostAPI,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => toast.error(error.message),
  });

  const updateMutation = useMutation<
    { message: string },
    Error,
    { values: CreatePostValues; id: number }
  >({
    mutationFn: updatePostAPI,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation<{ message: string }, Error, number>({
    mutationFn: deletePostAPI,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => toast.error(error.message),
  });

  return { createMutation, updateMutation, deleteMutation };
};
