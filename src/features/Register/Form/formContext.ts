import { createContext, useContext } from 'react';
import { Dispatch, SetStateAction } from 'react';

export const initialAccountData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    regulationsAgreement: false,
    privacyPolicyAgreement: false,
};

export const initialPaymentData = {
    cardNumber: '',
    expirationDate: '',
    cvc: '',
};

type FormContextValue = {
    accountData: typeof initialAccountData;
    paymentData: typeof initialPaymentData;
    setAccountData: Dispatch<SetStateAction<typeof initialAccountData>>;
    setPaymentData: Dispatch<SetStateAction<typeof initialPaymentData>>;
}

const formContextDefaultValue: FormContextValue = {
    accountData: initialAccountData,
    paymentData: initialPaymentData,
    setAccountData: () => {},
    setPaymentData: () => {}
}

export const FormContext = createContext(formContextDefaultValue);

export const useFormContext = () => {
    const args = useContext(FormContext);

    return args;
};