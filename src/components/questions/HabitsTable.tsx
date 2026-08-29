import type { HabitsData } from '../../types';
import { YesNoToggle } from './YesNoToggle';
import { VoiceButton } from '../ui/VoiceButton';

interface HabitsTableProps {
  habits: HabitsData;
  onChange: (path: string[], value: unknown) => void;
}

const WASH = [
  { value: 'Daily', label: 'Daily' },
  { value: 'Alternate Days', label: 'Every other day' },
  { value: 'Weekly', label: 'Weekly' },
];

const SMOKE = [
  { value: 'Mild <5/day', label: 'Under 5/day' },
  { value: 'Moderate 5-10/day', label: '5–10/day' },
  { value: 'Severe >10/day', label: 'Over 10/day' },
];

export function HabitsTable({ habits, onChange }: HabitsTableProps) {
  return (
    <div className="habit-list">
      <div className="habit-row">
        <span className="habit-row__label">Smoking</span>
        <YesNoToggle
          value={typeof habits.smoking === 'boolean' ? habits.smoking : null}
          onChange={(v) => onChange(['habits', 'smoking'], v)}
        />
      </div>
      {habits.smoking === true && (
        <div className="habit-follow">
          {SMOKE.map((o) => (
            <button
              key={o.value}
              type="button"
              className={`chip ${habits.smoking_severity === o.value ? 'chip--selected' : ''}`}
              onClick={() => onChange(['habits', 'smoking_severity'], o.value)}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}

      <div className="habit-row">
        <span className="habit-row__label">Alcohol</span>
        <YesNoToggle
          value={typeof habits.alcohol === 'boolean' ? habits.alcohol : null}
          onChange={(v) => onChange(['habits', 'alcohol'], v)}
        />
      </div>

      <div className="habit-row">
        <span className="habit-row__label">Hard water</span>
        <YesNoToggle
          value={typeof habits.hard_water === 'boolean' ? habits.hard_water : null}
          onChange={(v) => onChange(['habits', 'hard_water'], v)}
        />
      </div>

      <div className="habit-block">
        <span className="habit-row__label">Hair wash</span>
        <div className="chips">
          {WASH.map((o) => (
            <button
              key={o.value}
              type="button"
              className={`chip ${habits.hair_wash_frequency === o.value ? 'chip--selected' : ''}`}
              onClick={() => onChange(['habits', 'hair_wash_frequency'], o.value)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="habit-row">
        <span className="habit-row__label">Heat / chemicals</span>
        <YesNoToggle
          value={typeof habits.heating_tools_styling_chemicals === 'boolean' ? habits.heating_tools_styling_chemicals : null}
          onChange={(v) => onChange(['habits', 'heating_tools_styling_chemicals'], v)}
        />
      </div>

      <div className="habit-row">
        <span className="habit-row__label">Salon treatments</span>
        <YesNoToggle
          value={typeof habits.salon_treatments === 'boolean' ? habits.salon_treatments : null}
          onChange={(v) => onChange(['habits', 'salon_treatments'], v)}
        />
      </div>
      {habits.salon_treatments === true && (
        <div className="habit-follow">
          <textarea
            className="text-input"
            placeholder="Keratin, rebonding, smoothening…"
            value={typeof habits.salon_treatment_detail === 'string' ? habits.salon_treatment_detail : ''}
            onChange={(e) => onChange(['habits', 'salon_treatment_detail'], e.target.value)}
            rows={2}
            style={{ minHeight: 56 }}
          />
          <VoiceButton
            onResult={(text) => {
              const current = typeof habits.salon_treatment_detail === 'string' ? habits.salon_treatment_detail : '';
              onChange(['habits', 'salon_treatment_detail'], current ? `${current} ${text}` : text);
            }}
          />
        </div>
      )}
    </div>
  );
}
