import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ProgressPayload {
  lessonId: number;
  seconds: number;
  totalDuration: number;
  playlistId?: number;
}

const updateProgressAPI = async (data: ProgressPayload) => {
  try {
    const response = await fetch('/api/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      keepalive: true,
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to update progress:', error);
    return { success: false };
  }
};

export const useProgressMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProgressAPI,

    onSuccess: (data) => {
      if (data.isCompleted) {
        queryClient.invalidateQueries({ queryKey: ['progress'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      }
    },
    onError: (error) => {
      console.error('Background save failed:', error);
    },
  });
};
