import { useState } from 'react';
import { motion } from 'framer-motion';
import type { IntakeFormData } from '../types';
import { buildOutput } from '../lib/output';

interface ReviewScreenProps {
  data: IntakeFormData;
  lang?: 'en' | 'hi';
  onBack: () => void;
  onSubmit: () => void;
}

export function ReviewScreen({ data, lang = 'en', onBack, onSubmit }: ReviewScreenProps) {
  const [showJson, setShowJson] = useState(true);
  const output = buildOutput(data);
  const hi = lang === 'hi';

  return (
    <motion.div
      className="review"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
    >
      <div className="section-header">
        <p className="section-header__step">{hi ? 'Last check' : 'Last check'}</p>
        <h2 className="section-header__title">{hi ? 'Yeh doctor ko dikhega' : 'This is what the doctor gets'}</h2>
      </div>

      <div className="form-content">
        <div className="review__section">
          <h4 className="review__section-title">A · Hair loss history</h4>
          <ReviewRow label="Age it began" value={data.age_hair_loss_began ? `${data.age_hair_loss_began}` : null} />
          <ReviewRow label="Duration" value={data.duration} />
          <ReviewRow label="Family" value={data.family_history} />
          <ReviewRow label="Pattern" value={data.pattern} />
        </div>

        <div className="review__section">
          <h4 className="review__section-title">B · Health</h4>
          <ReviewRow label="Conditions" value={data.diagnosed_conditions} />
          {data.sex === 'female' && (
            <>
              <ReviewRow label="Cycle" value={data.menstrual_cycle} />
              <ReviewRow label="Pregnancy" value={data.pregnancy_related} />
            </>
          )}
          <ReviewRow label="Acne / oily skin" value={data.adult_acne_oily_skin} />
          <ReviewRow label="Extra body/facial hair" value={data.excess_body_facial_hair} />
        </div>

        <div className="review__section">
          <h4 className="review__section-title">C · Lifestyle</h4>
          <ReviewRow label="Past 6 months" value={data.past_6_months_none ? [] : data.past_6_months} />
          <ReviewRow label="Smoking" value={data.habits.smoking} />
          {data.habits.smoking && <ReviewRow label="How much" value={data.habits.smoking_severity} />}
          <ReviewRow label="Alcohol" value={data.habits.alcohol} />
          <ReviewRow label="Hard water" value={data.habits.hard_water} />
          <ReviewRow label="Hair wash" value={data.habits.hair_wash_frequency} />
          <ReviewRow label="Heat / chemicals" value={data.habits.heating_tools_styling_chemicals} />
          <ReviewRow label="Salon" value={data.habits.salon_treatments} />
          {data.habits.salon_treatments && data.habits.salon_treatment_detail && (
            <ReviewRow label="Salon detail" value={data.habits.salon_treatment_detail} />
          )}
        </div>

        <div className="review__section">
          <h4 className="review__section-title">D · Treatments</h4>
          {Object.entries(data.products).map(([name, prod]) =>
            prod.used ? (
              <ReviewRow
                key={name}
                label={name}
                value={`Used ${prod.duration || '?'}, ${prod.helped ? 'helped' : "didn't help"}${prod.side_effects ? ', side effects' : ''}`}
              />
            ) : null
          )}
          {Object.values(data.products).every((p) => !p.used) && <ReviewRow label="Products" value="None used" />}
          {Object.entries(data.procedures).map(([name, proc]) =>
            proc.done ? (
              <ReviewRow
                key={name}
                label={name}
                value={`${proc.sessions || '?'} sessions, ${proc.helped ? 'helped' : "didn't help"}`}
              />
            ) : null
          )}
          {Object.values(data.procedures).every((p) => !p.done) && <ReviewRow label="Procedures" value="None done" />}
          <ReviewRow label="Side effects" value={data.past_treatment_side_effects} />
          {data.past_treatment_side_effects && data.past_treatment_side_effects_describe && (
            <ReviewRow label="Details" value={data.past_treatment_side_effects_describe} />
          )}
        </div>

        <div className="review__section">
          <h4 className="review__section-title">E · Sample & consent</h4>
          <ReviewRow label="Sample" value={data.sample_type} />
          <ReviewRow label="Consent" value={data.consent} />
        </div>

        <div className="review__json-toggle">
          <button className="chip" onClick={() => setShowJson(!showJson)} type="button">
            {showJson ? 'Hide' : 'Show'} structured data
          </button>
        </div>

        {showJson && (
          <pre className="review__json">{JSON.stringify(output, null, 2)}</pre>
        )}
      </div>

      <div className="nav-bar">
        <button className="btn btn--secondary" onClick={onBack} type="button">
          {hi ? 'Edit' : 'Edit'}
        </button>
        <button className="btn btn--primary" onClick={onSubmit} type="button">
          {hi ? 'Submit' : 'Submit'}
        </button>
      </div>
    </motion.div>
  );
}

function ReviewRow({ label, value }: { label: string; value: unknown }) {
  const display = formatValue(value);
  const empty = isEmptyValue(value);

  return (
    <div className="review__row">
      <span className="review__label">{label}</span>
      <span className={`review__value ${empty ? 'review__value--empty' : ''}`}>{display}</span>
    </div>
  );
}

function formatValue(val: unknown): string {
  if (val === null || val === undefined) return 'Not answered';
  if (typeof val === 'boolean') return val ? 'Yes' : 'No';
  if (Array.isArray(val)) return val.length > 0 ? val.join(', ') : 'None';
  return String(val);
}

function isEmptyValue(val: unknown): boolean {
  if (val === null || val === undefined) return true;
  if (Array.isArray(val)) return val.length === 0;
  if (typeof val === 'string') return val.trim() === '';
  return false;
}
