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

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: UserPracticeScheduleInsert;
    }) => {
      const response = await fetch(`/api/admin/user-practice-schedules/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Podczas edycji planowanej praktyki wystapił błąd.');
      }

      const json = await response.json();

      return json;
    },
    onSuccess: () => {
      toast.success('Sukces', {
        description: `Zaktualizowano plan praktyki`,
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/user-practice-schedules/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Podczas usuwania planowanej praktyki wystapił błąd.');
      }

      const json = await response.json();

      return json;
    },
    onSuccess: () => {
      toast.success('Sukces', {
        description: `Usunięto plan praktyki`,
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};
