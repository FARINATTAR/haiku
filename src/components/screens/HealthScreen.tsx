import type {
  DiagnosedCondition,
  IntakeFormData,
  MenstrualCycle,
  PregnancyRelated,
} from '../../types';
import { MultiSelect } from '../questions/MultiSelect';
import { SingleSelect } from '../questions/SingleSelect';
import { YesNoToggle } from '../questions/YesNoToggle';

interface HealthScreenProps {
  data: IntakeFormData;
  lang: 'en' | 'hi';
  onConditions: (next: DiagnosedCondition[]) => void;
  onField: (field: string, value: unknown) => void;
  onApplyPcosHints: () => void;
}

const CONDITION_OPTIONS = [
  { value: 'PCOS/PCOD', label: 'PCOS / PCOD' },
  { value: 'Thyroid disorder', label: 'Thyroid' },
  { value: 'Diabetes', label: 'Diabetes' },
  { value: 'Autoimmune disease', label: 'Autoimmune' },
  { value: 'Anemia', label: 'Anemia / low iron' },
  { value: 'None', label: 'None of these' },
];

export function HealthScreen({ data, lang, onConditions, onField, onApplyPcosHints }: HealthScreenProps) {
  const hi = lang === 'hi';
  const female = data.sex === 'female';
  const hasPcos = data.diagnosed_conditions.includes('PCOS/PCOD');

  const toggleCondition = (val: string) => {
    const v = val as DiagnosedCondition;
    if (v === 'None') {
      onConditions(data.diagnosed_conditions.includes(v) ? [] : ['None']);
      return;
    }
    const without = data.diagnosed_conditions.filter((f) => f !== 'None');
    if (without.includes(v)) {
      onConditions(without.filter((f) => f !== v));
    } else {
      const next = [...without, v];
      onConditions(next);
      if (v === 'PCOS/PCOD' && female) {
        onApplyPcosHints();
      }
    }
  };

  return (
    <div className="screen-stack">
      <div className="question">
        <p className="question__label">{hi ? 'Inme se koi condition diagnose hui hai?' : 'Has a doctor diagnosed any of these?'}</p>
        <MultiSelect options={CONDITION_OPTIONS} selected={data.diagnosed_conditions} onToggle={toggleCondition} />
      </div>

      {hasPcos && female && (
        <p className="infer-banner">
          {hi
            ? 'PCOS ke saath aksar cycle irregular, acne, aur extra facial hair hota hai — neeche change kar sakte ho.'
            : 'With PCOS we marked irregular cycle, adult acne, and extra facial hair. Change anything that is not true for you.'}
        </p>
      )}

      {female && (
        <>
          <div className="question">
            <p className="question__label">{hi ? 'Menstrual cycle kaisa rehta hai?' : 'How is your menstrual cycle?'}</p>
            <SingleSelect
              options={[
                { value: 'Regular', label: 'Regular' },
                { value: 'Irregular', label: 'Irregular' },
                { value: 'Menopausal', label: 'Menopausal' },
                { value: 'Not applicable', label: 'Not applicable' },
              ]}
              value={data.menstrual_cycle}
              onChange={(v) => onField('menstrual_cycle', v as MenstrualCycle)}
            />
          </div>
          <div className="question">
            <p className="question__label">{hi ? 'Pregnancy se related kuch?' : 'Any pregnancy-related change?'}</p>
            <SingleSelect
              options={[
                { value: 'Currently pregnant', label: 'Currently pregnant' },
                { value: 'Postpartum <1 year', label: 'Had a baby in the last year' },
                { value: 'Not applicable', label: 'Not applicable' },
              ]}
              value={data.pregnancy_related}
              onChange={(v) => onField('pregnancy_related', v as PregnancyRelated)}
            />
          </div>
        </>
      )}

      <div className="question">
        <p className="question__label">{hi ? 'Adult acne ya oily skin?' : 'Acne or oily skin as an adult?'}</p>
        <YesNoToggle
          value={data.adult_acne_oily_skin}
          onChange={(v) => onField('adult_acne_oily_skin', v)}
        />
      </div>

      <div className="question">
        <p className="question__label">{hi ? 'Chehre ya body pe extra hair?' : 'Extra hair on the face or body?'}</p>
        <p className="question__subtitle">{hi ? 'Jaise upper lip, chin' : 'For example upper lip or chin'}</p>
        <YesNoToggle
          value={data.excess_body_facial_hair}
          onChange={(v) => onField('excess_body_facial_hair', v)}
        />
      </div>
    </div>
  );
}
