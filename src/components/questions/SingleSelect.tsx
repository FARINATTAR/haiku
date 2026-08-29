import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { haptic } from '../../lib/haptic';

export interface SingleSelectOption {
  value: string;
  label: string;
  desc?: string;
  info?: string;
}

interface SingleSelectProps {
  options: SingleSelectOption[];
  value: string | null;
  onChange: (value: string) => void;
  onAutoAdvance?: () => void;
}

export function SingleSelect({ options, value, onChange, onAutoAdvance }: SingleSelectProps) {
  const [activeInfo, setActiveInfo] = useState<string | null>(null);

  const handleSelect = (optValue: string) => {
    haptic();
    onChange(optValue);
    if (onAutoAdvance) {
      setTimeout(() => onAutoAdvance(), 350);
    }
  };

  return (
    <div className="singleselect-group">
      <div className="singleselect-list">
        {options.map((opt, i) => {
          const isSelected = value === opt.value;
          const showInfo = activeInfo === opt.value;

          return (
            <motion.div
              key={opt.value}
              className={`singleselect-card ${isSelected ? 'singleselect-card--selected' : ''}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.2 }}
            >
              <div
                className="singleselect-card__main"
                onClick={() => handleSelect(opt.value)}
                role="button"
                tabIndex={0}
              >
                {/* Radio circle indicator */}
                <div className={`radio-circle ${isSelected ? 'radio-circle--checked' : ''}`}>
                  {isSelected && <div className="radio-circle__dot" />}
                </div>

                <div className="singleselect-card__text">
                  <span className="singleselect-card__label">{opt.label}</span>
                  {opt.desc && <span className="singleselect-card__desc">{opt.desc}</span>}
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

              {/* Info Drawer */}
              <AnimatePresence>
                {showInfo && opt.info && (
                  <motion.div
                    className="singleselect-card__info-drawer"
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
    </div>
  );
}

