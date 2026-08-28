import { motion } from 'framer-motion';

interface YesNoToggleProps {
  value: boolean | null;
  onChange: (value: boolean) => void;
  yesLabel?: string;
  noLabel?: string;
  onAutoAdvance?: () => void;
}

export function YesNoToggle({ value, onChange, yesLabel = 'Yes', noLabel = 'No', onAutoAdvance }: YesNoToggleProps) {
  const handleSelect = (val: boolean) => {
    onChange(val);
    // Auto-advance only if no followup (e.g. "No" on side effects)
    // For "Yes" with followup, IntakeForm won't pass onAutoAdvance
    if (onAutoAdvance) {
      setTimeout(() => onAutoAdvance(), 400);
    }
  };

  return (
    <motion.div
      className="yesno-group"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <button
        className={`yesno-btn yesno-btn--yes ${value === true ? 'yesno-btn--selected' : ''}`}
        onClick={() => handleSelect(true)}
        type="button"
      >
        {yesLabel}
      </button>
      <button
        className={`yesno-btn yesno-btn--no ${value === false ? 'yesno-btn--selected' : ''}`}
        onClick={() => handleSelect(false)}
        type="button"
      >
        {noLabel}
      </button>
    </motion.div>
  );
}
