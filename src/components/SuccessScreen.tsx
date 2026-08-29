import { motion } from 'framer-motion';
import type { IntakeFormData } from '../types';

interface SuccessScreenProps {
  patientName: string;
  data: IntakeFormData;
  lang?: 'en' | 'hi';
  onReset: () => void;
}

export function SuccessScreen({ patientName, data, lang = 'en', onReset }: SuccessScreenProps) {
  const hi = lang === 'hi';

  // Build a concise doctor-facing summary
  const summaryRows: { label: string; value: string }[] = [
    { label: hi ? 'Shuru hua' : 'Hair loss onset', value: data.age_hair_loss_began ? `Age ${data.age_hair_loss_began}` : '—' },
    { label: hi ? 'Kitne time se' : 'Duration', value: data.duration || '—' },
    { label: hi ? 'Pattern' : 'Pattern', value: data.pattern.length > 0 ? data.pattern.join(', ') : '—' },
    { label: hi ? 'Family history' : 'Family history', value: data.family_history.length > 0 ? data.family_history.join(', ') : '—' },
    { label: hi ? 'Conditions' : 'Conditions', value: data.diagnosed_conditions.length > 0 ? data.diagnosed_conditions.join(', ') : '—' },
    { label: hi ? 'Sample' : 'Sample', value: data.sample_type || '—' },
  ];

  return (
    <motion.div
      className="welcome"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{ justifyContent: 'flex-start', paddingTop: 40 }}
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
        {hi ? `Ho gaya, ${patientName}!` : `All done, ${patientName}!`}
      </h1>

      <p className="welcome__subtitle">
        {hi
          ? 'Aapka intake form successfully submit ho gaya hai.'
          : 'Your intake form has been submitted successfully.'}
      </p>

      {/* Doctor summary card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{ width: '100%', maxWidth: 360 }}
      >
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          textAlign: 'left',
          boxShadow: 'var(--shadow-elevated)',
        }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
            {hi ? 'Aapki profile summary' : 'Your profile summary'}
          </p>
          {summaryRows.map((row) => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '6px 0', gap: 12 }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', flexShrink: 0 }}>{row.label}</span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)', textAlign: 'right', fontWeight: 500, wordBreak: 'break-word' }}>{row.value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* What happens next */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        style={{ width: '100%', maxWidth: 360, marginTop: 16 }}
      >
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          textAlign: 'left',
          boxShadow: 'var(--shadow-card)',
        }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 12, fontWeight: 500 }}>
            {hi ? 'Ab aage kya hoga?' : 'What happens next?'}
          </p>
          <ul style={{ fontSize: '0.85rem', color: 'var(--text-primary)', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
              {hi ? 'Doctor aapki profile review karenge' : 'Doctor reviews your profile'}
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
              {hi ? 'Visit pe sample collection hoga' : 'Sample collection at your visit'}
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
              {hi ? 'Personalised treatment plan milega' : 'Personalised treatment plan'}
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
          {hi ? 'Naya intake shuru karein' : 'Start new intake'}
        </button>
      </motion.div>
    </motion.div>
  );
}
