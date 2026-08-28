import { motion } from 'framer-motion';

interface SuccessScreenProps {
  patientName: string;
  onReset: () => void;
}

export function SuccessScreen({ patientName, onReset }: SuccessScreenProps) {
  return (
    <motion.div
      className="welcome"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="welcome__icon"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      >
        ✅
      </motion.div>

      <h1 className="welcome__title">
        All done, {patientName}!
      </h1>

      <p className="welcome__subtitle">
        Your intake form has been submitted. Your doctor will review your responses before your consultation.
      </p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        style={{ width: '100%', maxWidth: 320, marginTop: 16 }}
      >
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          textAlign: 'left',
        }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 8 }}>What happens next?</p>
          <ul style={{ fontSize: '0.85rem', color: 'var(--text-primary)', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li>📋 Doctor reviews your profile</li>
            <li>🧬 Sample collection at your visit</li>
            <li>📊 Personalised treatment plan</li>
          </ul>
        </div>
      </motion.div>

      <motion.div
        style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px', maxWidth: 480, margin: '0 auto' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <button
          className="btn btn--secondary"
          onClick={onReset}
          type="button"
          style={{ width: '100%' }}
        >
          Start new intake
        </button>
      </motion.div>
    </motion.div>
  );
}
