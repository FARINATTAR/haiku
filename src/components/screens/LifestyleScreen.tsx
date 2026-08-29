import type { IntakeFormData, PastSixMonthsTrigger } from '../../types';
import { SHEDDING_TRIGGERS, hasSuddenShedding } from '../../lib/inference';
import { MultiSelect } from '../questions/MultiSelect';
import { HabitsTable } from '../questions/HabitsTable';
import { haptic } from '../../lib/haptic';

interface LifestyleScreenProps {
  data: IntakeFormData;
  lang: 'en' | 'hi';
  onToggleTrigger: (value: PastSixMonthsTrigger) => void;
  onNone: () => void;
  onHabits: (path: string[], value: unknown) => void;
  onAddSheddingTriggers: () => void;
}

const TRIGGER_OPTIONS = [
  { value: 'Crash dieting or major weight loss', label: 'Crash diet or big weight loss' },
  { value: 'High stress or emotional trauma', label: 'High stress' },
  { value: 'Fever with illness (COVID, Dengue, Typhoid)', label: 'Fever or illness (COVID, dengue, typhoid)' },
  { value: 'Recent surgery', label: 'Recent surgery' },
  { value: 'Change in location/water/air quality', label: 'Moved, or water / air changed' },
];

export function LifestyleScreen({
  data,
  lang,
  onToggleTrigger,
  onNone,
  onHabits,
  onAddSheddingTriggers,
}: LifestyleScreenProps) {
  const hi = lang === 'hi';
  const shedding = hasSuddenShedding(data.pattern);
  const missingSuggested = shedding && SHEDDING_TRIGGERS.some((t) => !data.past_6_months.includes(t));

  return (
    <div className="screen-stack">
      <div className="question">
        <p className="question__label">{hi ? 'Pichle 6 months me kuch aisa hua?' : 'Anything like this in the last 6 months?'}</p>
        {shedding && missingSuggested && (
          <div className="infer-banner infer-banner--action">
            <span>
              {hi
                ? 'Sudden shedding aksar illness, stress, ya crash diet ke baad aata hai.'
                : 'Sudden shedding often follows illness, stress, or a crash diet.'}
            </span>
            <button
              type="button"
              className="infer-banner__btn"
              onClick={() => {
                haptic();
                onAddSheddingTriggers();
              }}
            >
              {hi ? 'Haan, ye apply hote hain' : 'These apply'}
            </button>
          </div>
        )}
        <MultiSelect
          options={TRIGGER_OPTIONS}
          selected={data.past_6_months}
          onToggle={(v) => onToggleTrigger(v as PastSixMonthsTrigger)}
        />
        <button
          type="button"
          className={`chip none-chip ${data.past_6_months_none ? 'chip--selected' : ''}`}
          onClick={() => {
            haptic();
            onNone();
          }}
        >
          {hi ? 'Kuch nahi' : 'None of these'}
        </button>
      </div>

      <div className="question">
        <p className="question__label">{hi ? 'Rozmarra ki habits' : 'Day-to-day habits'}</p>
        <p className="question__subtitle">
          {hi ? 'Khara paani taps pe safed daag chhodta hai' : 'Hard water often leaves white scale on taps'}
        </p>
        <HabitsTable habits={data.habits} onChange={onHabits} />
      </div>
    </div>
  );
}
