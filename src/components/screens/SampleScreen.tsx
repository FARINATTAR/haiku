import type { IntakeFormData, SampleType } from '../../types';
import { SingleSelect } from '../questions/SingleSelect';

interface SampleScreenProps {
  data: IntakeFormData;
  lang: 'en' | 'hi';
  onSample: (v: SampleType) => void;
  onConsent: (v: boolean | null) => void;
}

export function SampleScreen({ data, lang, onSample, onConsent }: SampleScreenProps) {
  const hi = lang === 'hi';

  return (
    <div className="screen-stack">
      <div className="question">
        <p className="question__label">{hi ? 'Sample kaise dena pasand karenge?' : 'How would you rather give a sample?'}</p>
        <p className="question__subtitle">
          {hi ? 'Saliva — tube me spit. Blood — chhota prick.' : 'Saliva is spit in a tube. Blood is a small prick.'}
        </p>
        <SingleSelect
          options={[
            { value: 'Saliva', label: hi ? 'Saliva' : 'Saliva' },
            { value: 'Blood', label: hi ? 'Blood' : 'Blood' },
            { value: 'Either', label: hi ? 'Jo bhi chale' : 'Either is fine' },
          ]}
          value={data.sample_type}
          onChange={(v) => onSample(v as SampleType)}
        />
      </div>

      <div className="question">
        <p className="question__label">{hi ? 'Genetic test ke liye consent' : 'Consent for sample and genetic analysis'}</p>
        <div className="consent-card">
          <p className="consent-card__text">
            {hi
              ? 'Main saliva ya blood sample dene ki consent deti/deta hoon, hair aur scalp ke genetic analysis ke liye. Results mere treatment plan ke liye use honge.'
              : 'I agree to give a saliva or blood sample for genetic analysis related to hair and scalp health. Results will be used to plan my treatment.'}
          </p>
          <button
            type="button"
            className={`consent-card__check ${data.consent === true ? 'consent-card__check--agreed' : ''}`}
            onClick={() => onConsent(data.consent === true ? null : true)}
          >
            {data.consent === true ? '✓' : ''}
          </button>
          <p
            className="consent-card__status"
            style={{ color: data.consent === true ? 'var(--accent)' : 'var(--text-muted)' }}
          >
            {data.consent === true
              ? hi
                ? 'Consent de diya'
                : 'Consent given'
              : hi
                ? 'Agree karne ke liye tap karein'
                : 'Tap to agree'}
          </p>
        </div>
      </div>
    </div>
  );
}
