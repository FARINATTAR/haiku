import type { FormStep } from '../types';
import { PATIENT_STEPS } from '../types';

interface ProgressBarProps {
  currentStep: FormStep;
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  if (currentStep === 'welcome') return null;

  const idx = PATIENT_STEPS.indexOf(currentStep);
  const isReview = currentStep === 'review';
  const progress = isReview ? 100 : ((idx + 1) / PATIENT_STEPS.length) * 100;
  const label = isReview ? 'Review' : `${idx + 1} of ${PATIENT_STEPS.length}`;

  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div className="progress-bar__fill" style={{ width: `${progress}%` }} />
      </div>
      <span className="progress-bar__label">{label}</span>
    </div>
  );
}
