'use client';

import { cn } from '@/lib/utils';

export interface StepperProps {
  steps: {
    label: string;
  }[];
  currentStep: number;
  onStepChange: (stepIndex: number) => void;
}

export default function Stepper({
  steps,
  onStepChange,
  currentStep,
}: StepperProps) {
  const handleStepChange = (stepIndex: number) => {
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
