'use client';

import RegisterForm from '@/features/Register/Form/RegisterForm';
import Container from '@/components/Container/Container';
import Order from '@/features/Register/Order/Order';
import React, { useState } from 'react';
import { FormContext, initialAccountData, initialPaymentData } from '@/features/Register/Form/formContext';

export default function SignIn() {
  const [accountData, setAccountData] = useState(initialAccountData);
  const [paymentData, setPaymentData] = useState(initialPaymentData);

  return (
    <section>
      <Container className="pt-6 pb-32">
        <div className="grid grid-cols-12 gap-24">
          <FormContext.Provider
            value={{ accountData, paymentData, setAccountData, setPaymentData }}
          >
            <RegisterForm />
            <Order nextStepDisabled={false} />
          </FormContext.Provider>
        </div>
      </Container>
    </section>
  );
}
