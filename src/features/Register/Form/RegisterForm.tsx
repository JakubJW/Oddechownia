'use-client';

import Stepper from '../../../components/Stepper/Stepper';
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import AccountData from './Steps/AccountData';
import PaymentData from './Steps/PaymentData';
import { formSchema } from './schema';

export interface RegisterFormProps {
  ref: React.Ref<typeof RegisterForm>;
}

const registerSteps = [
  { label: 'Dane konta' },
  { label: 'Dane płatności' },
  { label: 'Podsumowanie' },
];

const defaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  regulationsAgreement: false,
  privacyPolicyAgreement: false,
  cardNumber: '',
  expirationDate: '',
  cvc: '',
};

export default function RegisterForm() {
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'all'
  });

  const handleStepChange = (stepIndex: number) => {
    form.trigger([
      'firstName',
      'lastName',
      'email',
      'password',
      'passwordConfirmation',
      'privacyPolicyAgreement',
      'regulationsAgreement',
    ]);

    if (Object.keys(form.formState.errors).length) {
      return;
    }

    setCurrentStep(stepIndex);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <div className="col-span-6">
      <Stepper
        steps={registerSteps}
        currentStep={currentStep}
        onStepChange={handleStepChange}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {currentStep === 0 && <AccountData form={form} />}
          {currentStep === 1 && <PaymentData form={form} />}
        </form>
      </Form>
    </div>
  );
}
