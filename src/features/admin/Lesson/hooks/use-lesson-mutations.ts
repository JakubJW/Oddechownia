import { queryClient } from '@/components/QueryClientProvider';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CreateLessonValues, UpdateLessonValues } from '../Form/schema';
import { BaseLesson } from '@/server/db/types';

export const useLessonMutations = () => {
  const createLessonAPI = async (values: CreateLessonValues) => {
    const res = await fetch(`/api/admin/lessons`, {
      method: 'POST',
      body: JSON.stringify(values),
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
    return json as BaseLesson;
  };

  const updateLessonAPI = async ({
    id,
    values,
  }: {
    id: number;
    values: UpdateLessonValues;
  }) => {
    const res = await fetch(`/api/admin/lessons/${id}`, {
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
    return json as BaseLesson;
  };

  const deleteLessonAPI = async (id: number) => {
    const res = await fetch(`/api/admin/lessons/${id}`, {
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

  const createMutation = useMutation({
    mutationFn: createLessonAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
    onError: (error) => toast.error(error.message),
  });

  const updateMutation = useMutation({
    mutationFn: updateLessonAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLessonAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
    onError: (error) => toast.error(error.message),
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
};
