import { useState } from 'react';
import { motion } from 'framer-motion';
import type { IntakeFormData } from '../types';

interface ReviewScreenProps {
  data: IntakeFormData;
  onBack: () => void;
  onSubmit: () => void;
}

export function ReviewScreen({ data, onBack, onSubmit }: ReviewScreenProps) {
  const [showJson, setShowJson] = useState(false);

  const output = buildOutput(data);

  return (
    <motion.div
      className="review"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="section-header">
        <p className="section-header__step">Almost done ✨</p>
        <h2 className="section-header__title">Review your answers</h2>
      </div>

      <div className="form-content">
        {/* Section A */}
        <div className="review__section">
          <h4 className="review__section-title">A · Hair Loss History</h4>
          <ReviewRow label="Age hair loss began" value={data.age_hair_loss_began ? `${data.age_hair_loss_began} years old` : null} />
          <ReviewRow label="Duration" value={data.duration} />
          <ReviewRow label="Family history" value={data.family_history} />
          <ReviewRow label="Pattern" value={data.pattern} />
        </div>

        {/* Section B */}
        <div className="review__section">
          <h4 className="review__section-title">B · Health & Hormones</h4>
          <ReviewRow label="Conditions" value={data.diagnosed_conditions} />
          {data.sex === 'female' && (
            <>
              <ReviewRow label="Menstrual cycle" value={data.menstrual_cycle} />
              <ReviewRow label="Pregnancy related" value={data.pregnancy_related} />
            </>
          )}
          <ReviewRow label="Acne / oily skin" value={data.adult_acne_oily_skin} />
          <ReviewRow label="Excess body/facial hair" value={data.excess_body_facial_hair} />
        </div>

        {/* Section C */}
        <div className="review__section">
          <h4 className="review__section-title">C · Lifestyle</h4>
          <ReviewRow label="Past 6 months" value={data.past_6_months} />
          <ReviewRow label="Smoking" value={data.habits.smoking} />
          {data.habits.smoking && (
            <ReviewRow label="Smoking severity" value={data.habits.smoking_severity} />
          )}
          <ReviewRow label="Alcohol" value={data.habits.alcohol} />
          <ReviewRow label="Hard water" value={data.habits.hard_water} />
          <ReviewRow label="Hair wash" value={data.habits.hair_wash_frequency} />
          <ReviewRow label="Heating tools" value={data.habits.heating_tools_styling_chemicals} />
          <ReviewRow label="Salon treatments" value={data.habits.salon_treatments} />
          {data.habits.salon_treatments && data.habits.salon_treatment_detail && (
            <ReviewRow label="Salon details" value={data.habits.salon_treatment_detail} />
          )}
        </div>

        {/* Section D */}
        <div className="review__section">
          <h4 className="review__section-title">D · Treatments</h4>
          {Object.entries(data.products).map(([name, prod]) => (
            prod.used ? (
              <ReviewRow key={name} label={name} value={`Used ${prod.duration || '?'}, ${prod.helped ? 'helped' : 'didn\'t help'}${prod.side_effects ? ', had side effects' : ''}`} />
            ) : null
          ))}
          {Object.values(data.products).every(p => !p.used) && (
            <ReviewRow label="Products" value="None used" />
          )}
          {Object.entries(data.procedures).map(([name, proc]) => (
            proc.done ? (
              <ReviewRow key={name} label={name} value={`${proc.sessions || '?'} sessions, ${proc.helped ? 'helped' : 'didn\'t help'}`} />
            ) : null
          ))}
          {Object.values(data.procedures).every(p => !p.done) && (
            <ReviewRow label="Procedures" value="None done" />
          )}
          <ReviewRow label="Side effects" value={data.past_treatment_side_effects} />
          {data.past_treatment_side_effects && data.past_treatment_side_effects_describe && (
            <ReviewRow label="Details" value={data.past_treatment_side_effects_describe} />
          )}
        </div>

        {/* Section E */}
        <div className="review__section">
          <h4 className="review__section-title">E · Sample & Consent</h4>
          <ReviewRow label="Sample type" value={data.sample_type} />
          <ReviewRow label="Consent" value={data.consent} />
        </div>

        {/* JSON toggle */}
        <div className="review__json-toggle">
          <button
            className="chip"
            onClick={() => setShowJson(!showJson)}
            type="button"
          >
            {showJson ? '🔼 Hide' : '🔽 Show'} structured data (JSON)
          </button>
        </div>

        {showJson && (
          <motion.pre
            className="review__json"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            {JSON.stringify(output, null, 2)}
          </motion.pre>
        )}
      </div>

      {/* Nav */}
      <div className="nav-bar">
        <button className="btn btn--secondary" onClick={onBack} type="button">
          ← Edit
        </button>
        <button className="btn btn--primary" onClick={onSubmit} type="button">
          Submit ✓
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
      <span className={`review__value ${empty ? 'review__value--empty' : ''}`}>
        {display}
      </span>
    </div>
  );
}

function formatValue(val: unknown): string {
  if (val === null || val === undefined) return 'Not answered';
  if (typeof val === 'boolean') return val ? 'Yes' : 'No';
  if (Array.isArray(val)) return val.length > 0 ? val.join(', ') : 'None selected';
  return String(val);
}

function isEmptyValue(val: unknown): boolean {
  if (val === null || val === undefined) return true;
  if (Array.isArray(val)) return val.length === 0;
  if (typeof val === 'string') return val.trim() === '';
  return false;
}

function buildOutput(data: IntakeFormData) {
  return {
    form: 'GenoRoot Hair & Scalp Intake',
    patient_name: data.patient_name,
    sex: data.sex,
    sections: {
      A: {
        age_hair_loss_began: data.age_hair_loss_began,
        duration: data.duration,
        family_history: data.family_history,
        pattern: data.pattern,
      },
      B: {
        diagnosed_conditions: data.diagnosed_conditions,
        menstrual_cycle: data.menstrual_cycle,
        pregnancy_related: data.pregnancy_related,
        adult_acne_oily_skin: data.adult_acne_oily_skin,
        excess_body_facial_hair: data.excess_body_facial_hair,
      },
      C: {
        past_6_months: data.past_6_months,
        habits: data.habits,
      },
      D: {
        products: data.products,
        procedures: data.procedures,
        past_treatment_side_effects: data.past_treatment_side_effects,
        ...(data.past_treatment_side_effects_describe
          ? { past_treatment_side_effects_describe: data.past_treatment_side_effects_describe }
          : {}),
      },
      E: {
        sample_type: data.sample_type,
        consent: data.consent,
      },
    },
  };
}
