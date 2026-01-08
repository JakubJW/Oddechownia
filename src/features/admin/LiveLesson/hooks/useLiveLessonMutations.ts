import { queryClient } from '@/components/QueryClientProvider';
import { CreateLiveLessonResponse } from '@/server/models/liveLesson.models';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CreateLiveLessonValues, UpdateLiveLessonValues } from '../Form/schema';
import { UpdateLiveLessonResponse } from '@/server/models/liveLesson.models';

export const useLiveLessonMutations = () => {
  const createLiveLessonAPI = async (values: CreateLiveLessonValues) => {
    const res = await fetch(`/api/live-lessons/create`, {
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
    return json.data as CreateLiveLessonResponse;
  };

  const updateLiveLessonAPI = async ({
    id,
    values,
  }: {
    id: string;
    values: UpdateLiveLessonValues;
  }) => {
    const res = await fetch(`/api/live-lessons/${id}`, {
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
    return json.data as UpdateLiveLessonResponse;
  };

  const createMutation = useMutation({
    mutationFn: createLiveLessonAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['live-lessons'] });
    },
    onError: (error) => toast.error(error.message),
  });

  const updateMutation = useMutation({
    mutationFn: updateLiveLessonAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['live-lessons'] });
    },
    onError: (error) => toast.error(error.message),
  });

  return {
    createMutation,
    updateMutation,
  };
};
