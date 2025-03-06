'use client';

import { useFormContext } from '../formContext';

export default function Summary() {
  const { accountData, paymentData } = useFormContext();

  const { firstName, lastName, email } = accountData;
  const { cardNumber, cvc, expirationDate } = paymentData;

  return (
    <div>
      <p>Dane konta</p>
      <div>
        <p>{firstName}</p>
        <p>{lastName}</p>
        <p>{email}</p>
      </div>
      <p className='mb-4'>Dane płatności</p>
      <div>
        <p>{cardNumber}</p>
        <p>{cvc}</p>
        <p>{expirationDate}</p>
      </div>
    </div>
  );
}
