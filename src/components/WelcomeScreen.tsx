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

const sexOptions: { value: Sex; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="welcome__title">
        Let's understand your hair better
      </h1>

      <p className="welcome__subtitle">
        A quick intake to help your doctor prepare the best plan for you
      </p>

      <motion.input
        className="welcome__input"
        type="text"
        placeholder="Your name"
        value={patientName}
        onChange={(e) => onNameChange(e.target.value)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        autoFocus
      />
      <VoiceButton onResult={(text) => onNameChange(text)} />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{ width: '100%', maxWidth: 320 }}
      >
        <p className="welcome__sex-label">I am</p>
        <div className="chips" style={{ justifyContent: 'center' }}>
          {sexOptions.map((opt) => (
            <button
              key={opt.value}
              className={`chip ${sex === opt.value ? 'chip--selected' : ''}`}
              onClick={() => onSexChange(opt.value)}
              type="button"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="nav-bar"
        style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px', maxWidth: 480, margin: '0 auto' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: canContinue ? 1 : 0.4, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <button
          className="btn btn--primary"
          onClick={onContinue}
          disabled={!canContinue}
          type="button"
        >
          Begin Intake →
        </button>
      </motion.div>
    </motion.div>
  );
}
