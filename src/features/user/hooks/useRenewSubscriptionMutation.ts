import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

type RenewSubscriptionValues = {
  priceId: string;
  clientReferenceId: string;
  customerId: string;
};

const renewSubscriptionAPI = async (
  values: RenewSubscriptionValues
): Promise<{ url: string }> => {
  const res = await fetch('/api/subscription/renew', {
    method: 'POST',
    body: JSON.stringify(values),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Wystąpił błąd rejestracji');
  }

  return data;
};

export const useRenewSubscriptionMutation = () => {
  return useMutation<
    Awaited<ReturnType<typeof renewSubscriptionAPI>>,
    Error,
    RenewSubscriptionValues
  >({
    mutationFn: renewSubscriptionAPI,

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
