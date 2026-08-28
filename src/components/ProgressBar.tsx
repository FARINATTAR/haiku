import { motion } from 'framer-motion';
import type { FormStep } from '../types';
import { SECTIONS } from '../lib/formConfig';

interface ProgressBarProps {
  currentStep: FormStep;
}

const STEP_ORDER: FormStep[] = ['welcome', 'A', 'B', 'C', 'D', 'E', 'review'];

export function ProgressBar({ currentStep }: ProgressBarProps) {
  if (currentStep === 'welcome') return null;

  const currentIndex = STEP_ORDER.indexOf(currentStep);

  return (
    <div className="progress">
      {SECTIONS.map((section, i) => {
        const sectionIndex = i + 1; // offset for 'welcome'
        let className = 'progress__segment';

        if (sectionIndex < currentIndex) {
          className += ' progress__segment--completed';
        } else if (sectionIndex === currentIndex) {
          className += ' progress__segment--active';
        }

        return (
          <motion.div
            key={section.id}
            className={className}
            initial={false}
            animate={{
              opacity: 1,
            }}
            layout
          />
        );
      })}
    </div>
  );
}
