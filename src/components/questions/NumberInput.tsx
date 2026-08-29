import { motion } from 'framer-motion';
import { haptic } from '../../lib/haptic';

interface NumberInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  min?: number;
  max?: number;
  unit?: string;
  autoFocus?: boolean;
}

const commonAges = [18, 21, 25, 28, 32, 38];

export function NumberInput({ value, onChange, min = 1, max = 80, unit = 'years old', autoFocus = false }: NumberInputProps) {
  const displayValue = value !== null ? value : '';

  const increment = () => {
    haptic();
    const next = (value ?? min - 1) + 1;
    if (next <= max) onChange(next);
  };

  const decrement = () => {
    haptic();
    const next = (value ?? min + 1) - 1;
    if (next >= min) onChange(next);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.trim();
    if (raw === '') {
      onChange(null);
      return;
    }
    const num = parseInt(raw, 10);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      onChange(num);
    }
  };

  return (
    <motion.div
      className="number-input-container"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="number-input-card">
        <button
          className="number-input__btn"
          onClick={decrement}
          type="button"
          aria-label="Decrease age"
        >
          −
        </button>

        <div className="number-input__field-wrapper">
          <input
            className="number-input__typeable"
            type="number"
            value={displayValue}
            onChange={handleInputChange}
            min={min}
            max={max}
            placeholder="Age"
            inputMode="numeric"
            autoFocus={autoFocus}
          />
          <span className="number-input__unit-label">{unit}</span>
        </div>

        <button
          className="number-input__btn"
          onClick={increment}
          type="button"
          aria-label="Increase age"
        >
          +
        </button>
      </div>

      {/* Quick selection suggestions */}
      <div className="number-quick-pills">
        <span className="number-quick-label">Quick select:</span>
        <div className="number-quick-list">
          {commonAges.map((age) => (
            <button
              key={age}
              type="button"
              className={`number-pill ${value === age ? 'number-pill--active' : ''}`}
              onClick={() => {
                haptic();
                onChange(age);
              }}
            >
              {age}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
