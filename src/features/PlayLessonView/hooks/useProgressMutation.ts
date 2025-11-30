import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

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
      // CRITICAL: This allows the request to finish even if the user closes the tab
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
  const router = useRouter();

  return useMutation({
    mutationFn: updateProgressAPI,

    // We handle success logic centrally here
    onSuccess: (data) => {
      // 1. If the lesson just got marked as completed
      if (data.isCompleted) {
        // Invalidate specific queries if you are fetching progress via React Query
        queryClient.invalidateQueries({ queryKey: ['progress'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });

        // Refresh Server Components (like the Dashboard page)
        router.refresh();
      }
    },
    onError: (error) => {
      // Optional: Silent fail for heartbeats is usually better than spamming toasts
      console.error('Background save failed:', error);
    },
  });
};
