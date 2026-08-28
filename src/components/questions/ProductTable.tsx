import { motion, AnimatePresence } from 'framer-motion';
import type { ProductRow } from '../../types';
import { SingleSelect } from './SingleSelect';
import { YesNoToggle } from './YesNoToggle';

interface ProductTableProps {
  products: Record<string, ProductRow>;
  onChange: (path: string[], value: unknown) => void;
}

const PRODUCT_ICONS: Record<string, string> = {
  'OTC/Medicated Shampoos': '🧴',
  'Hair Oils/Serums': '💧',
  'Topical Minoxidil': '💊',
  'Oral Minoxidil': '💉',
  'Supplements': '🌿',
};

const DURATION_OPTIONS = [
  { value: '<3mo', label: 'Under 3 months' },
  { value: '3-6mo', label: '3–6 months' },
  { value: '>6mo', label: 'Over 6 months' },
];

export function ProductTable({ products, onChange }: ProductTableProps) {
  return (
    <div>
      {Object.entries(products).map(([name, product], i) => {
        const isUsed = product.used;

        return (
          <motion.div
            key={name}
            className={`expand-card ${isUsed ? 'expand-card--active' : ''}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div
              className="expand-card__header"
              onClick={() => onChange(['products', name, 'used'], !isUsed)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '1.2rem' }}>{PRODUCT_ICONS[name] || '📦'}</span>
                <span className="expand-card__title">{name}</span>
              </div>
              <div
                className={`toggle ${isUsed ? 'toggle--on' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(['products', name, 'used'], !isUsed);
                }}
              >
                <div className="toggle__knob" />
              </div>
            </div>

            <AnimatePresence>
              {isUsed && (
                <motion.div
                  className="expand-card__body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
                      How long have you used it?
                    </p>
                    <SingleSelect
                      options={DURATION_OPTIONS}
                      value={product.duration || null}
                      onChange={(v) => onChange(['products', name, 'duration'], v)}
                    />
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
                      Did it help?
                    </p>
                    <YesNoToggle
                      value={product.helped ?? null}
                      onChange={(v) => onChange(['products', name, 'helped'], v)}
                    />
                  </div>

                  <div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
                      Any side effects?
                    </p>
                    <YesNoToggle
                      value={product.side_effects ?? null}
                      onChange={(v) => onChange(['products', name, 'side_effects'], v)}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
