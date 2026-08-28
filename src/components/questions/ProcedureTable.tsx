import { motion, AnimatePresence } from 'framer-motion';
import type { ProcedureRow } from '../../types';
import { SingleSelect } from './SingleSelect';
import { YesNoToggle } from './YesNoToggle';

interface ProcedureTableProps {
  procedures: Record<string, ProcedureRow>;
  onChange: (path: string[], value: unknown) => void;
}


const SESSION_OPTIONS = [
  { value: '1-3', label: '1–3 sessions' },
  { value: '4-6', label: '4–6 sessions' },
  { value: '>6', label: 'More than 6' },
];

export function ProcedureTable({ procedures, onChange }: ProcedureTableProps) {
  return (
    <div>
      {Object.entries(procedures).map(([name, procedure], i) => {
        const isDone = procedure.done;

        return (
          <motion.div
            key={name}
            className={`expand-card ${isDone ? 'expand-card--active' : ''}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div
              className="expand-card__header"
              onClick={() => onChange(['procedures', name, 'done'], !isDone)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="expand-card__title">{name}</span>
              </div>
              <div
                className={`toggle ${isDone ? 'toggle--on' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(['procedures', name, 'done'], !isDone);
                }}
              >
                <div className="toggle__knob" />
              </div>
            </div>

            <AnimatePresence>
              {isDone && (
                <motion.div
                  className="expand-card__body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
                      How many sessions?
                    </p>
                    <SingleSelect
                      options={SESSION_OPTIONS}
                      value={procedure.sessions || null}
                      onChange={(v) => onChange(['procedures', name, 'sessions'], v)}
                    />
                  </div>

                  <div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
                      Did it help?
                    </p>
                    <YesNoToggle
                      value={procedure.helped ?? null}
                      onChange={(v) => onChange(['procedures', name, 'helped'], v)}
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
