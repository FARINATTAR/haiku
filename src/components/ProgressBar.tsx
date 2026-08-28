import { motion } from 'framer-motion';
import type { FormStep } from '../types';

interface ProgressBarProps {
  currentStep: FormStep;
  totalQuestions: number;
}

export function ProgressBar({ currentStep, totalQuestions }: ProgressBarProps) {
  if (currentStep === 0) return null; // welcome screen

  const isReview = currentStep > totalQuestions;
  const progress = isReview ? 100 : ((currentStep - 1) / totalQuestions) * 100;

  return (
    <div className="progress-container">
      <div className="progress-bar">
        <motion.div
          className="progress-bar__fill"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
      <span className="progress-bar__label">
        {isReview ? 'Review' : `${currentStep} of ${totalQuestions}`}
      </span>
    </div>
  );
}
