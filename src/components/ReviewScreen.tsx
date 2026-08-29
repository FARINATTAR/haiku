import { useState } from 'react';
import { motion } from 'framer-motion';
import type { IntakeFormData } from '../types';

interface ReviewScreenProps {
  data: IntakeFormData;
  lang?: 'en' | 'hi';
  onBack: () => void;
  onSubmit: () => void;
}

export function ReviewScreen({ data, lang = 'en', onBack, onSubmit }: ReviewScreenProps) {
  const [showJson, setShowJson] = useState(false);

  const output = buildOutput(data);

  const hi = lang === 'hi';

  return (
    <motion.div
      className="review"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="section-header">
        <p className="section-header__step">{hi ? 'Lagbhag ho gaya ✨' : 'Almost done ✨'}</p>
        <h2 className="section-header__title">{hi ? 'Apne answers review karein' : 'Review your answers'}</h2>
      </div>

      <div className="form-content">
        {/* Section A */}
        <div className="review__section">
          <h4 className="review__section-title">{hi ? 'A · Hair Loss History' : 'A · Hair Loss History'}</h4>
          <ReviewRow label={hi ? 'Kis age me shuru hua' : 'Age hair loss began'} value={data.age_hair_loss_began ? `${data.age_hair_loss_began} ${hi ? 'saal' : 'years old'}` : null} />
          <ReviewRow label={hi ? 'Kitne time se' : 'Duration'} value={data.duration} />
          <ReviewRow label={hi ? 'Family history' : 'Family history'} value={data.family_history} />
          <ReviewRow label={hi ? 'Pattern' : 'Pattern'} value={data.pattern} />
        </div>

        {/* Section B */}
        <div className="review__section">
          <h4 className="review__section-title">{hi ? 'B · Health & Hormones' : 'B · Health & Hormones'}</h4>
          <ReviewRow label={hi ? 'Conditions' : 'Conditions'} value={data.diagnosed_conditions} />
          {data.sex === 'female' && (
            <>
              <ReviewRow label={hi ? 'Menstrual cycle' : 'Menstrual cycle'} value={data.menstrual_cycle} />
              <ReviewRow label={hi ? 'Pregnancy se related' : 'Pregnancy related'} value={data.pregnancy_related} />
            </>
          )}
          <ReviewRow label={hi ? 'Acne / oily skin' : 'Acne / oily skin'} value={data.adult_acne_oily_skin} />
          <ReviewRow label={hi ? 'Extra body/facial hair' : 'Excess body/facial hair'} value={data.excess_body_facial_hair} />
        </div>

        {/* Section C */}
        <div className="review__section">
          <h4 className="review__section-title">{hi ? 'C · Lifestyle' : 'C · Lifestyle'}</h4>
          <ReviewRow label={hi ? 'Pichle 6 months' : 'Past 6 months'} value={data.past_6_months} />
          <ReviewRow label={hi ? 'Smoking' : 'Smoking'} value={data.habits.smoking} />
          {data.habits.smoking && (
            <ReviewRow label={hi ? 'Kitna' : 'Smoking severity'} value={data.habits.smoking_severity} />
          )}
          <ReviewRow label={hi ? 'Sharaab' : 'Alcohol'} value={data.habits.alcohol} />
          <ReviewRow label={hi ? 'Khara paani' : 'Hard water'} value={data.habits.hard_water} />
          <ReviewRow label={hi ? 'Hair wash' : 'Hair wash'} value={data.habits.hair_wash_frequency} />
          <ReviewRow label={hi ? 'Heating tools' : 'Heating tools'} value={data.habits.heating_tools_styling_chemicals} />
          <ReviewRow label={hi ? 'Salon treatments' : 'Salon treatments'} value={data.habits.salon_treatments} />
          {data.habits.salon_treatments && data.habits.salon_treatment_detail && (
            <ReviewRow label={hi ? 'Salon details' : 'Salon details'} value={data.habits.salon_treatment_detail} />
          )}
        </div>

        {/* Section D */}
        <div className="review__section">
          <h4 className="review__section-title">{hi ? 'D · Treatments' : 'D · Treatments'}</h4>
          {Object.entries(data.products).map(([name, prod]) => (
            prod.used ? (
              <ReviewRow key={name} label={name} value={`${hi ? 'Use kiya' : 'Used'} ${prod.duration || '?'}, ${prod.helped ? (hi ? 'fayda hua' : 'helped') : (hi ? 'fayda nahi hua' : 'didn\'t help')}${prod.side_effects ? (hi ? ', side effects hue' : ', had side effects') : ''}`} />
            ) : null
          ))}
          {Object.values(data.products).every(p => !p.used) && (
            <ReviewRow label={hi ? 'Products' : 'Products'} value={hi ? 'Koi nahi use kiya' : 'None used'} />
          )}
          {Object.entries(data.procedures).map(([name, proc]) => (
            proc.done ? (
              <ReviewRow key={name} label={name} value={`${proc.sessions || '?'} sessions, ${proc.helped ? (hi ? 'fayda hua' : 'helped') : (hi ? 'fayda nahi hua' : 'didn\'t help')}`} />
            ) : null
          ))}
          {Object.values(data.procedures).every(p => !p.done) && (
            <ReviewRow label={hi ? 'Procedures' : 'Procedures'} value={hi ? 'Koi nahi karwaya' : 'None done'} />
          )}
          <ReviewRow label={hi ? 'Side effects' : 'Side effects'} value={data.past_treatment_side_effects} />
          {data.past_treatment_side_effects && data.past_treatment_side_effects_describe && (
            <ReviewRow label={hi ? 'Details' : 'Details'} value={data.past_treatment_side_effects_describe} />
          )}
        </div>

        {/* Section E */}
        <div className="review__section">
          <h4 className="review__section-title">{hi ? 'E · Sample & Consent' : 'E · Sample & Consent'}</h4>
          <ReviewRow label={hi ? 'Sample type' : 'Sample type'} value={data.sample_type} />
          <ReviewRow label={hi ? 'Consent' : 'Consent'} value={data.consent} />
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
          {hi ? '← Edit Karein' : '← Edit'}
        </button>
        <button className="btn btn--primary" onClick={onSubmit} type="button">
          {hi ? 'Submit Karein ✓' : 'Submit ✓'}
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
