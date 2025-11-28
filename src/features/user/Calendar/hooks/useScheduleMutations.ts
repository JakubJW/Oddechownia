import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useDeletePractice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (scheduleId: string) => {
      const res = await fetch(`/api/calendar/events/${scheduleId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        // Try to parse error message from JSON, fallback to generic
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete');
      }
    },
    onSuccess: () => {
      toast.success('Usunięto praktykę');
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
};

export const useUpdatePractice = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      date,
      isCompleted,
    }: {
      id: string;
      date: string;
      isCompleted?: boolean;
    }) => {
      const res = await fetch(`/api/calendar/events/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduledAt: date, isCompleted }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to update');
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success('Zaktualizowano termin');
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });

      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
};
