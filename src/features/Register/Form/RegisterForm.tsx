'use client';

import Stepper from '../../../components/Stepper/Stepper';
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import AccountData from './Steps/AccountData';
import PaymentData from './Steps/PaymentData';
import { formSchema } from './schema';
import { signup } from '@/app/rejestracja/actions';
import { useFormContext } from './formContext';
import { initialPaymentData, initialAccountData } from './formContext';
import Summary from './Steps/Summary';

const registerSteps = [
  { label: 'Dane konta' },
  { label: 'Dane płatności' },
  { label: 'Podsumowanie' },
];

export default function RegisterForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const { setAccountData, setPaymentData } = useFormContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountData: initialAccountData,
      paymentData: initialPaymentData,
    },
    mode: 'all',
  });

  const handleStepChange = (stepIndex: number) => {
    switch (stepIndex) {
      case 1:
        form.trigger('accountData');

        if (form.formState.errors.accountData) {
          return;
        }

        setAccountData((prevState) => ({
          ...prevState,
          ...form.getValues('accountData'),
        }));
        setCurrentStep(stepIndex);

        break;
      case 2:
        form.trigger('paymentData');

        if (form.formState.errors.paymentData) {
          return;
        }

        setPaymentData((prevState) => ({
          ...prevState,
          ...form.getValues('paymentData'),
        }));

        setCurrentStep(stepIndex);
        break;
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append('email', values.accountData.email);
    formData.append('password', values.accountData.password);

    await signup(formData);
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
          {currentStep === 2 && <Summary />}
          <button type="submit">Zarejestruj</button>
        </form>
      </Form>
    </div>
  );
}
