'use client';

import { signup } from '@/app/rejestracja/actions';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Stepper from '../../../components/Stepper/Stepper';
import {
  initialAccountData,
  initialPaymentData,
  useFormContext,
} from './formContext';
import { formSchema } from './schema';
import AccountData from './Steps/AccountData';
import PaymentData from './Steps/PaymentData';
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
    formData.append('firstName', values.accountData.firstName);
    formData.append('lastName', values.accountData.lastName);
    formData.append('regulationsAgreement', String(values.accountData.regulationsAgreement));
    formData.append('privacyPolicyAgreement', String(values.accountData.privacyPolicyAgreement));

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
