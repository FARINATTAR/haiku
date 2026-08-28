import { motion } from 'framer-motion';

interface YesNoToggleProps {
  value: boolean | null;
  onChange: (value: boolean) => void;
  yesLabel?: string;
  noLabel?: string;
}

export function YesNoToggle({ value, onChange, yesLabel = 'Yes', noLabel = 'No' }: YesNoToggleProps) {
  return (
    <motion.div
      className="yesno-group"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <button
        className={`yesno-btn yesno-btn--yes ${value === true ? 'yesno-btn--selected' : ''}`}
        onClick={() => onChange(true)}
        type="button"
      >
        {yesLabel}
      </button>
      <button
        className={`yesno-btn yesno-btn--no ${value === false ? 'yesno-btn--selected' : ''}`}
        onClick={() => onChange(false)}
        type="button"
      >
        {noLabel}
      </button>
    </motion.div>
  );
}
