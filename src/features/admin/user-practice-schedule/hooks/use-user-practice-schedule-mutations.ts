import { UserPracticeScheduleInsert } from '@/entities/models/user-practice-schedule';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUserPracticeScheduleMutations = () => {
  const createMutation = useMutation({
    mutationFn: async (values: UserPracticeScheduleInsert) => {
      const response = await fetch('/api/admin/user-practice-schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to schedule lesson');
      }

      const json = await response.json();

      return json;
    },
    onSuccess: () => {
      toast.success('Zajęcia zaplanowane', {
        description: `Dodano do kalendarza.`,
      });
    },
    onError: () => {
      toast.error('Wystąpił błąd');
    },
  });

  return { createMutation };
};
