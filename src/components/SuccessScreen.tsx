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
        style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
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
          boxShadow: 'var(--shadow-card)',
        }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 12, fontWeight: 500 }}>What happens next?</p>
          <ul style={{ fontSize: '0.85rem', color: 'var(--text-primary)', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
              Doctor reviews your profile
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
              Sample collection at your visit
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
              Personalised treatment plan
            </li>
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
