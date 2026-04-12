import { LiveLessonSignUpResponse } from '@/server/models/liveLesson.models';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

const signUpAPI = async (id: string) => {
  const res = await fetch(`/api/products/${id}/claim`, {
    method: 'POST',
  });

  if (!res.ok) {
    const errorBody = (await res.json()) as { message: string };

    throw new Error(errorBody.message || 'Unknown error');
  }

  const json = await res.json();
  return json.data as LiveLessonSignUpResponse;
};

export const useLiveLessonMutations = () => {
  const signUpMutation = useMutation<LiveLessonSignUpResponse, Error, string>({
    mutationFn: signUpAPI,
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }

      if (!data.url) {
        toast.success('Zapisano na zajęcia');
        window.location.href = '/moje-konto/zajecia-na-zywo';
      }
    },
    onError: (error) => toast.error(error.message),
  });

  return {
    signUpMutation,
  };
};
