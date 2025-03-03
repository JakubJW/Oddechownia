'use-client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export interface StepperProps {
  steps: {
    label: string;
  }[];
  onStepChange: (stepIndex: number) => void;
}

export default function Stepper({ steps, onStepChange }: StepperProps) {
  const [currentStep, setCurrentStep] = useState(steps.indexOf(steps[0]));

  const handleStepChange = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    onStepChange(stepIndex);
  };

  const active = (index: number) => {
    return currentStep === index;
  };

  return (
    <ol className="stepper">
      {steps.map(({ label }, index) => (
        <li
          key={index}
          onClick={() => handleStepChange(index)}
          className={cn(
            active(index) && 'stepper__item-active',
            'stepper__item'
          )}
        >
          <span
            className={cn(
              active(index) && 'stepper__item__bullet-active',
              'stepper__item__bullet'
            )}
          >
            {index + 1}
          </span>
          <p
            className={cn(
              active(index) && 'stepper__item__title-active',
              'stepper__item__title'
            )}
          >
            {label}
          </p>
        </li>
      ))}
    </ol>
  );
}
