import { useMutation } from '@tanstack/react-query';
import { RegisterFormValues } from '../Form/schema';
import { toast } from 'sonner';

const registerAPI = async (
  values: RegisterFormValues
): Promise<{ url: string }> => {
  const formData = new FormData();

  formData.append('email', values.email);
  formData.append('password', values.password);
  formData.append('passwordConfirmation', values.passwordConfirmation);
  formData.append('firstName', values.firstName);
  formData.append('lastName', values.lastName);
  formData.append('regulationsAgreement', String(values.regulationsAgreement));
  formData.append(
    'privacyPolicyAgreement',
    String(values.privacyPolicyAgreement)
  );

  const res = await fetch('/api/register', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Wystąpił błąd rejestracji');
  }

  return data;
};

export const useRegisterMutation = () => {
  return useMutation<
    Awaited<ReturnType<typeof registerAPI>>,
    Error,
    RegisterFormValues
  >({
    mutationFn: registerAPI,

    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
