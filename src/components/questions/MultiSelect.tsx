import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { haptic } from '../../lib/haptic';

export interface MultiSelectOption {
  value: string;
  label: string;
  desc?: string;
  info?: string;
  icon?: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onToggle: (value: string) => void;
  otherValue?: string;
  onOtherChange?: (val: string) => void;
  otherPlaceholder?: string;
}

export function MultiSelect({
  options,
  selected,
  onToggle,
  otherValue = '',
  onOtherChange,
  otherPlaceholder = 'Please specify details...',
}: MultiSelectProps) {
  const [activeInfo, setActiveInfo] = useState<string | null>(null);

  const hasOther = options.some((o) => o.value.toLowerCase().includes('other'));
  const isOtherSelected = selected.some((v) => v.toLowerCase().includes('other'));

  return (
    <div className="multiselect-group">
      <div className="multiselect-list">
        {options.map((opt, i) => {
          const isSelected = selected.includes(opt.value);
          const showInfo = activeInfo === opt.value;

          return (
            <motion.div
              key={opt.value}
              className={`multiselect-card ${isSelected ? 'multiselect-card--selected' : ''}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.2 }}
            >
              <div
                className="multiselect-card__main"
                onClick={() => {
                  haptic();
                  onToggle(opt.value);
                }}
                role="button"
                tabIndex={0}
              >
                {/* Square Checkbox Icon */}
                <div className={`square-checkbox ${isSelected ? 'square-checkbox--checked' : ''}`}>
                  {isSelected && (
                    <motion.svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 350 }}
                    >
                      <path
                        d="M2 6.2l2.8 2.8L10 3"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  )}
                </div>

                <div className="multiselect-card__text">
                  <span className="multiselect-card__label">{opt.label}</span>
                  {opt.desc && <span className="multiselect-card__desc">{opt.desc}</span>}
                </div>
              </div>

              {/* Info Tooltip Trigger (if info text exists) */}
              {opt.info && (
                <button
                  type="button"
                  className={`info-pill-btn ${showInfo ? 'info-pill-btn--active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    haptic();
                    setActiveInfo(showInfo ? null : opt.value);
                  }}
                  aria-label={`What is ${opt.label}?`}
                >
                  i
                </button>
              )}

              {/* Info Explanation Drawer */}
              <AnimatePresence>
                {showInfo && opt.info && (
                  <motion.div
                    className="multiselect-card__info-drawer"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="info-drawer__badge">Doctor Note</span>
                    <p className="info-drawer__text">{opt.info}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Optional other text input when Other is selected */}
      {hasOther && isOtherSelected && onOtherChange && (
        <motion.div
          className="other-input-box"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <label className="other-input-label">Tell us more:</label>
          <input
            type="text"
            className="text-input"
            placeholder={otherPlaceholder}
            value={otherValue}
            onChange={(e) => onOtherChange(e.target.value)}
            autoFocus
          />
        </motion.div>
      )}
    </div>
  );
}

