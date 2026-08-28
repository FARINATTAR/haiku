import { motion } from 'framer-motion';
import { haptic } from '../../lib/haptic';

interface MultiSelectProps {
  options: { value: string; label: string; icon?: string }[];
  selected: string[];
  onToggle: (value: string) => void;
}

export function MultiSelect({ options, selected, onToggle }: MultiSelectProps) {
  return (
    <div className="chips">
      {options.map((opt, i) => {
        const isSelected = selected.includes(opt.value);
        return (
          <motion.button
            key={opt.value}
            className={`chip ${isSelected ? 'chip--selected' : ''}`}
            onClick={() => { haptic(); onToggle(opt.value); }}
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.2 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="chip__check">
              {isSelected && (
                <motion.svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              )}
            </span>
            {opt.icon && <span className="chip__icon">{opt.icon}</span>}
            {opt.label}
          </motion.button>
        );
      })}
    </div>
  );
}
