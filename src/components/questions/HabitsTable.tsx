import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { HabitsData } from '../../types';
import { YesNoToggle } from './YesNoToggle';
import { SingleSelect } from './SingleSelect';
import { VoiceButton } from '../ui/VoiceButton';

interface HabitsTableProps {
  habits: HabitsData;
  onChange: (path: string[], value: unknown) => void;
}

interface HabitConfig {
  key: string;
  label: string;
  icon: string;
  type: 'yesno' | 'select';
  options?: { value: string; label: string }[];
  followup?: {
    key: string;
    label: string;
    type: 'select' | 'text';
    options?: { value: string; label: string }[];
  };
}

const HABITS: HabitConfig[] = [
  {
    key: 'smoking',
    label: 'Smoking',
    icon: '🚬',
    type: 'yesno',
    followup: {
      key: 'smoking_severity',
      label: 'How much?',
      type: 'select',
      options: [
        { value: 'Mild <5/day', label: 'Light (<5/day)' },
        { value: 'Moderate 5-10/day', label: 'Moderate (5-10/day)' },
        { value: 'Severe >10/day', label: 'Heavy (>10/day)' },
      ],
    },
  },
  {
    key: 'alcohol',
    label: 'Alcohol consumption',
    icon: '🍷',
    type: 'yesno',
  },
  {
    key: 'hard_water',
    label: 'Hard water for hair wash',
    icon: '🚿',
    type: 'yesno',
  },
  {
    key: 'hair_wash_frequency',
    label: 'Hair wash frequency',
    icon: '🧴',
    type: 'select',
    options: [
      { value: 'Daily', label: 'Daily' },
      { value: 'Alternate Days', label: 'Alternate Days' },
      { value: 'Weekly', label: 'Weekly' },
    ],
  },
  {
    key: 'heating_tools_styling_chemicals',
    label: 'Heating tools or styling chemicals',
    icon: '💇',
    type: 'yesno',
  },
  {
    key: 'salon_treatments',
    label: 'Salon treatments (keratin, rebonding etc.)',
    icon: '💈',
    type: 'yesno',
    followup: {
      key: 'salon_treatment_detail',
      label: 'Which treatments?',
      type: 'text',
    },
  },
];

export function HabitsTable({ habits, onChange }: HabitsTableProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div>
      {HABITS.map((habit, i) => {
        const isExpanded = expandedIndex === i;
        const value = habits[habit.key];
        const hasFollowup = habit.followup && value === true;
        const isActive = value !== null && value !== undefined;

        return (
          <motion.div
            key={habit.key}
            className={`expand-card ${isActive ? 'expand-card--active' : ''}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div
              className="expand-card__header"
              onClick={() => setExpandedIndex(isExpanded ? null : i)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '1.2rem' }}>{habit.icon}</span>
                <span className="expand-card__title">{habit.label}</span>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', transition: 'transform 200ms' }}>
                {isExpanded ? '▲' : '▼'}
              </span>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  className="expand-card__body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {habit.type === 'yesno' && (
                    <YesNoToggle
                      value={typeof value === 'boolean' ? value : null}
                      onChange={(v) => onChange(['habits', habit.key], v)}
                    />
                  )}

                  {habit.type === 'select' && habit.options && (
                    <SingleSelect
                      options={habit.options}
                      value={typeof value === 'string' ? value : null}
                      onChange={(v) => onChange(['habits', habit.key], v)}
                    />
                  )}

                  {/* Follow-up */}
                  <AnimatePresence>
                    {hasFollowup && habit.followup && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ marginTop: 12 }}
                      >
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
                          {habit.followup.label}
                        </p>

                        {habit.followup.type === 'select' && habit.followup.options && (
                          <SingleSelect
                            options={habit.followup.options}
                            value={typeof habits[habit.followup.key] === 'string' ? (habits[habit.followup.key] as string) : null}
                            onChange={(v) => onChange(['habits', habit.followup!.key], v)}
                          />
                        )}

                        {habit.followup.type === 'text' && (
                          <>
                            <textarea
                              className="text-input"
                              placeholder="e.g., Keratin treatment 3 months ago..."
                              value={typeof habits[habit.followup.key] === 'string' ? (habits[habit.followup.key] as string) : ''}
                              onChange={(e) => onChange(['habits', habit.followup!.key], e.target.value)}
                              rows={2}
                              style={{ minHeight: 60 }}
                            />
                            <VoiceButton
                              onResult={(text) => {
                                const current = typeof habits[habit.followup!.key] === 'string' ? (habits[habit.followup!.key] as string) : '';
                                onChange(['habits', habit.followup!.key], current ? `${current} ${text}` : text);
                              }}
                            />
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
