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

const whoOptions: { value: Sex; label: string; desc: string }[] = [
  { value: 'female', label: 'A woman', desc: 'Includes cycle / pregnancy questions' },
  { value: 'male', label: 'A man', desc: 'Skips those questions' },
  { value: 'other', label: 'Skip those', desc: 'Prefer not to say' },
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
    >
      <div className="welcome__header-box">
        <h1 className="welcome__title">Hair intake</h1>
        <p className="welcome__subtitle">
          A few screens. Tap what is true. Your doctor sees the filled form before you walk in.
        </p>
      </div>

      <div className="welcome__card">
        <div className="welcome__field">
          <label className="welcome__label" htmlFor="patient-name-input">
            Your name
          </label>
          <div className="welcome__input-wrapper">
            <input
              id="patient-name-input"
              className="welcome__input"
              type="text"
              placeholder="First name is enough"
              value={patientName}
              onChange={(e) => onNameChange(e.target.value)}
              autoFocus
            />
            <div className="welcome__input-mic">
              <VoiceButton onResult={(text) => onNameChange(text)} />
            </div>
          </div>
        </div>

        <div className="welcome__field" style={{ marginTop: 20 }}>
          <label className="welcome__label">Who is this for?</label>
          <p className="welcome__field-hint" style={{ marginBottom: 8 }}>
            Two questions are only useful if you menstruate. Everyone else skips them.
          </p>
          <div className="sex-grid">
            {whoOptions.map((opt) => {
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
          style={{ width: '100%' }}
        >
          {canContinue ? 'Start' : 'Name and who this is for'}
        </button>
      </div>
    </motion.div>
  );
}
