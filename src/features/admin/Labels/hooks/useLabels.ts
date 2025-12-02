import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '@/components/QueryClientProvider';
import { CreateLabelValues } from '../createLabelFormSchema';
import { toast } from 'sonner';

const getLabelsAPI = async () => {
  const res = await fetch(`/api/labels`, {
    method: 'GET',
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

const createLabelAPI = async (values: CreateLabelValues) => {
  const res = await fetch(`/api/labels`, {
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

const updateLabelAPI = async ({
  values,
  id,
}: {
  values: CreateLabelValues;
  id: number;
}) => {
  const res = await fetch(`/api/labels/${id}`, {
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

const deleteLabelAPI = async (id: number) => {
  const res = await fetch(`/api/labels/${id}`, {
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

export const useLabels = () => {
  const queryLabels = useQuery<{
    data: { id: number; text: string; color: string }[];
  }>({
    queryFn: getLabelsAPI,
    queryKey: ['labels'],
  });

  const createMutation = useMutation<
    { message: string },
    Error,
    CreateLabelValues
  >({
    mutationFn: createLabelAPI,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['labels'] });
    },
    onError: (error) => toast.error(error.message),
  });

  const updateMutation = useMutation<
    { message: string },
    Error,
    { values: CreateLabelValues; id: number }
  >({
    mutationFn: updateLabelAPI,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['labels'] });
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation<{ message: string }, Error, number>({
    mutationFn: deleteLabelAPI,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['labels'] });
    },
    onError: (error) => toast.error(error.message),
  });

  return { createMutation, updateMutation, deleteMutation, queryLabels };
};
