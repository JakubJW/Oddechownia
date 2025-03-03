'use-client';

import Stepper from '../Stepper/Stepper';
import { useState } from 'react';

const registerSteps = [
  { label: 'Dane konta' },
  { label: 'Dane płatności' },
  { label: 'Podsumowanie' },
];

export default function RegisterForm() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleStepChange = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  return (
    <div className="max-w-[1000px]">
      <Stepper
        steps={registerSteps}
        onStepChange={handleStepChange}
      />
      <div className="p-4 bg-primaryBg">
        {currentStep === 0 && <h1>Twoje dane</h1>}
        {currentStep === 1 && <h1>Danne płatności</h1>}
        {currentStep === 2 && <h1>Podsumowanie</h1>}
      </div>
    </div>
  );
}
