import { motion } from 'framer-motion';
import type { Sex } from '../types';
import { VoiceButton } from './ui/VoiceButton';

interface WelcomeScreenProps {
  patientName: string;
  sex: Sex | null;
  onNameChange: (name: string) => void;
  onSexChange: (sex: Sex) => void;
  onContinue: () => void;
}

const sexOptions: { value: Sex; label: string; desc: string }[] = [
  { value: 'male', label: 'Male', desc: 'Biological male' },
  { value: 'female', label: 'Female', desc: 'Biological female' },
  { value: 'other', label: 'Other', desc: 'Non-binary / Other' },
];

export function WelcomeScreen({
  patientName,
  sex,
  onNameChange,
  onSexChange,
  onContinue,
}: WelcomeScreenProps) {
  const canContinue = patientName.trim().length > 0 && sex !== null;

  return (
    <motion.div
      className="welcome"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
    >
      <div className="welcome__header-box">
        <span className="welcome__tag">Personalized Scalp & Genetics</span>
        <h1 className="welcome__title">
          Let's understand your hair better
        </h1>
        <p className="welcome__subtitle">
          A 2-minute clinical intake to help your trichologist design your personalized root-cause treatment plan.
        </p>
      </div>

      <div className="welcome__card">
        {/* Name Field */}
        <div className="welcome__field">
          <label className="welcome__label" htmlFor="patient-name-input">
            Full Name <span className="welcome__req">*</span>
          </label>
          <div className="welcome__input-wrapper">
            <input
              id="patient-name-input"
              className="welcome__input"
              type="text"
              placeholder="e.g. Farin Attar"
              value={patientName}
              onChange={(e) => onNameChange(e.target.value)}
              autoFocus
            />
            <div className="welcome__input-mic">
              <VoiceButton onResult={(text) => onNameChange(text)} />
            </div>
          </div>
        </div>

        {/* Biological Sex Field */}
        <div className="welcome__field" style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <label className="welcome__label">
              Biological Sex <span className="welcome__req">*</span>
            </label>
            <span className="welcome__field-hint">Required for hormonal screening</span>
          </div>
          <div className="sex-grid">
            {sexOptions.map((opt) => {
              const isSelected = sex === opt.value;
              return (
                <button
                  key={opt.value}
                  className={`sex-card ${isSelected ? 'sex-card--selected' : ''}`}
                  onClick={() => onSexChange(opt.value)}
                  type="button"
                >
                  <span className="sex-card__label">{opt.label}</span>
                  <span className="sex-card__desc">{opt.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="welcome__footer">
        <button
          className="btn btn--primary"
          onClick={onContinue}
          disabled={!canContinue}
          type="button"
          style={{ width: '100%', padding: '14px 24px', fontSize: '1rem' }}
        >
          {canContinue ? 'Begin Hair Intake →' : 'Enter your name & sex to start'}
        </button>
        <p className="welcome__security-note">
          🔒 Strictly confidential · Used only for your genetic & clinical analysis
        </p>
      </div>
    </motion.div>
  );
}

