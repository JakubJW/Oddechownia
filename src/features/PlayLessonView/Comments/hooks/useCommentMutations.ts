import { useMutation } from '@tanstack/react-query';
import { CreateCommentValues } from '../Form/schema';
import { CommentDetailDTO } from '@/server/models/comment.models';
import { toast } from 'sonner';

export const useCommentMutations = () => {
  const createCommentAPI = async (values: CreateCommentValues) => {
    const res = await fetch(`/api/comments`, {
      method: 'POST',
      body: JSON.stringify(values),
    });

    const json = await res.json();
    return json.data;
  };

  const removeCommentAPI = async (id: number) => {
    const res = await fetch(`/api/comments/${id}`, {
      method: 'DELETE',
    });

    const json = await res.json();
    return json.data;
  };

  const createMutation = useMutation<
    CommentDetailDTO,
    Error,
    CreateCommentValues
  >({
    mutationFn: createCommentAPI,
    onSuccess: () => {
      toast.success('Twój komentarz został dodany.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: removeCommentAPI,
  });

  return {
    createMutation,
    deleteMutation,
  };
};
