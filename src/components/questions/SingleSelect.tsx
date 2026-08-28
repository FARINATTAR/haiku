import { motion } from 'framer-motion';

interface SingleSelectProps {
  options: { value: string; label: string }[];
  value: string | null;
  onChange: (value: string) => void;
  onAutoAdvance?: () => void;
}

export function SingleSelect({ options, value, onChange, onAutoAdvance }: SingleSelectProps) {
  const handleSelect = (optValue: string) => {
    onChange(optValue);
    // Auto-advance after a short delay so the user sees the selection
    if (onAutoAdvance) {
      setTimeout(() => onAutoAdvance(), 400);
    }
  };

  return (
    <div className="chips">
      {options.map((opt, i) => (
        <motion.button
          key={opt.value}
          className={`chip ${value === opt.value ? 'chip--selected' : ''}`}
          onClick={() => handleSelect(opt.value)}
          type="button"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.2 }}
          whileTap={{ scale: 0.97 }}
        >
          {opt.label}
        </motion.button>
      ))}
    </div>
  );
}
