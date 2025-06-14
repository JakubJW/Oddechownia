'use client';

import { cn } from '@/lib/utils';

export interface StepperProps {
  steps: {
    label: string;
  }[];
  currentStep: number;
  onNextStep: (stepIndex: number) => void;
  onPrevStep: (stepIndex: number) => void;
}

export default function Stepper({
  steps,
  onNextStep,
  onPrevStep,
  currentStep,
}: StepperProps) {

  const handleStepChange = (stepIndex: number) => {
    if (stepIndex === currentStep) {
      return;
    } else if (stepIndex > currentStep) {
      onNextStep(stepIndex);
    } else {
      onPrevStep(stepIndex);
    }
  };

  const active = (index: number) => {
    return currentStep === index;
  };

  return (
    <ol className="stepper">
      {steps.map(({ label }, index) => (
        <li
          key={index}
          className={cn(
            active(index) && 'stepper__item-active',
            'stepper__item'
          )}
        >
          <span
            onClick={() => handleStepChange(index)}
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
