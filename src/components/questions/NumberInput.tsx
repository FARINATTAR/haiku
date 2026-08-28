import { motion } from 'framer-motion';

interface NumberInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  min?: number;
  max?: number;
  unit?: string;
}

export function NumberInput({ value, onChange, min = 1, max = 80, unit = 'years old' }: NumberInputProps) {
  const displayValue = value ?? '';

  const increment = () => {
    const next = (value ?? min - 1) + 1;
    if (next <= max) onChange(next);
  };

  const decrement = () => {
    const next = (value ?? min + 1) - 1;
    if (next >= min) onChange(next);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      onChange(null);
      return;
    }
    const num = parseInt(raw, 10);
    if (!isNaN(num) && num >= min && num <= max) {
      onChange(num);
    }
  };

  return (
    <motion.div
      className="number-input"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <button className="number-input__btn" onClick={decrement} type="button" aria-label="Decrease">
        −
      </button>
      <div style={{ textAlign: 'center' }}>
        <input
          className="number-input__value"
          type="number"
          value={displayValue}
          onChange={handleInputChange}
          min={min}
          max={max}
          placeholder="—"
          inputMode="numeric"
        />
        <div className="number-input__unit">{unit}</div>
      </div>
      <button className="number-input__btn" onClick={increment} type="button" aria-label="Increase">
        +
      </button>
    </motion.div>
  );
}
