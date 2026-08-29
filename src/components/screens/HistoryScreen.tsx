import type { FamilyHistory, HairLossPattern, IntakeFormData, Sex } from '../../types';
import { MultiSelect } from '../questions/MultiSelect';
import { ScalpMap } from '../questions/ScalpMap';

interface HistoryScreenProps {
  data: IntakeFormData;
  lang: 'en' | 'hi';
  onFamily: (next: FamilyHistory[]) => void;
  onTogglePattern: (value: HairLossPattern) => void;
}

const FAMILY_OPTIONS = [
  { value: 'Father had hair loss', label: 'Father', desc: 'Dad, or his side of the family' },
  { value: 'Mother had hair loss', label: 'Mother', desc: 'Mum, or her side of the family' },
  { value: 'Siblings with thinning or baldness', label: 'Brother or sister' },
  { value: 'No known family history', label: 'No one that I know of' },
];

export function HistoryScreen({ data, lang, onFamily, onTogglePattern }: HistoryScreenProps) {
  const hi = lang === 'hi';
  const sex: Sex | null = data.sex;

  const toggleFamily = (val: string) => {
    const v = val as FamilyHistory;
    if (v === 'No known family history') {
      onFamily(data.family_history.includes(v) ? [] : [v]);
      return;
    }
    const without = data.family_history.filter((f) => f !== 'No known family history');
    if (without.includes(v)) {
      onFamily(without.filter((f) => f !== v));
    } else {
      onFamily([...without, v]);
    }
  };

  return (
    <div className="screen-stack">
      <div className="question">
        <p className="question__label">{hi ? 'Family me kisi ko hair loss hai?' : 'Does anyone in the family have hair loss?'}</p>
        <p className="question__subtitle">{hi ? 'Jo apply ho, select karein' : 'Select all that apply'}</p>
        <MultiSelect options={FAMILY_OPTIONS} selected={data.family_history} onToggle={toggleFamily} />
      </div>

      <div className="question">
        <p className="question__label">{hi ? 'Baal kahan se kam ho rahe hain?' : 'Where do you notice it?'}</p>
        <ScalpMap
          selected={data.pattern}
          onToggle={onTogglePattern}
          emphasizePart={sex !== 'male'}
        />
      </div>
    </div>
  );
}
