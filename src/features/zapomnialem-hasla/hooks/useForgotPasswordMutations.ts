import { useMutation } from '@tanstack/react-query';
import {
  RequestPasswordResetFormValues,
  SetNewPasswordFormValues,
} from '../requestResetPasswordFormSchema';

export const useForgotPasswordMutations = () => {
  const reuqestPasswordResetAPI = async (
    values: RequestPasswordResetFormValues
  ) => {
    const res = await fetch('/api/forgot-password/request-password-reset', {
      method: 'POST',
      body: JSON.stringify(values),
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.message || 'Wystąpił podczas zmiany hasła');
    }

    return json;
  };

  const setNewPasswordAPI = async (values: SetNewPasswordFormValues) => {
    const formData = new FormData();

    formData.set('password', values.password);
    formData.set('confirmPassword', values.confirmPassword);

    const res = await fetch('/api/forgot-password/set-new-password', {
      method: 'POST',
      body: formData,
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(
        json.message || 'Wystąpił błąd podczas ustawiania nowego hasła'
      );
    }

    return json;
  };

  const requestPasswordResetMutaion = useMutation<
    Awaited<ReturnType<typeof reuqestPasswordResetAPI>>,
    Error,
    RequestPasswordResetFormValues
  >({
    mutationFn: reuqestPasswordResetAPI,
  });

  const setNewPasswordMutation = useMutation<
    Awaited<ReturnType<typeof setNewPasswordAPI>>,
    Error,
    SetNewPasswordFormValues
  >({
    mutationFn: setNewPasswordAPI,
  });

  return {
    requestPasswordResetMutaion,
    setNewPasswordMutation,
  };
};
