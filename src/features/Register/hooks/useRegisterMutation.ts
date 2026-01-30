import { useMutation } from '@tanstack/react-query';
import { RegisterFormValues } from '../Form/registerFormSchema';
import { toast } from 'sonner';

export class ApiFieldError extends Error {
  field: string;

  constructor(field: string, message: string) {
    super(message);
    this.name = 'ApiFieldError';
    this.field = field;
  }
}

const registerAPI = async (values: RegisterFormValues) => {
  const formData = new FormData();

  formData.append('email', values.email);
  formData.append('password', values.password);
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

  const json = await res.json();

  if (!res.ok) {
    if (res.status === 409) {
      throw new ApiFieldError(
        'email',
        json.message || 'Ten e-mail jest już zajęty.'
      );
    }

    throw new Error(json.message || 'Wystąpił błąd rejestracji');
  }

  return json as { url: string };
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
      if (!(error instanceof ApiFieldError)) {
        toast.error(error.message);
      }
    },
  });
};
