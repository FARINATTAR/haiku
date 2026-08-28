import { motion } from 'framer-motion';

interface SingleSelectProps {
  options: { value: string; label: string; icon?: string }[];
  value: string | null;
  onChange: (value: string) => void;
}

export function SingleSelect({ options, value, onChange }: SingleSelectProps) {
  return (
    <div className="chips">
      {options.map((opt, i) => (
        <motion.button
          key={opt.value}
          className={`chip ${value === opt.value ? 'chip--selected' : ''}`}
          onClick={() => onChange(opt.value)}
          type="button"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.2 }}
          whileTap={{ scale: 0.97 }}
        >
          {opt.icon && <span className="chip__icon">{opt.icon}</span>}
          {opt.label}
        </motion.button>
      ))}
    </div>
  );
}
