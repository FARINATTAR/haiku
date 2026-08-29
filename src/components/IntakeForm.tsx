import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormState } from '../hooks/useFormState';
import type { FormStep, HairLossPattern, PastSixMonthsTrigger } from '../types';
import { PATIENT_STEPS } from '../types';
import { STEP_META, UNUSED_PRODUCTS, UNUSED_PROCEDURES } from '../lib/formConfig';
import { isStepValid } from '../lib/validation';
import { SHEDDING_TRIGGERS } from '../lib/inference';
import { buildOutput } from '../lib/output';
import { ProgressBar } from './ProgressBar';
import { WelcomeScreen } from './WelcomeScreen';
import { ReviewScreen } from './ReviewScreen';
import { SuccessScreen } from './SuccessScreen';
import { OnsetScreen } from './screens/OnsetScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { HealthScreen } from './screens/HealthScreen';
import { LifestyleScreen } from './screens/LifestyleScreen';
import { TreatmentsScreen } from './screens/TreatmentsScreen';
import { SampleScreen } from './screens/SampleScreen';

const FLOW: FormStep[] = ['welcome', ...PATIENT_STEPS, 'review'];

export function IntakeForm() {
  const { data, currentStep, setField, setNested, patch, setStep, reset } = useFormState();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [direction, setDirection] = useState(1);
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  const goNext = useCallback(() => {
    if (!isStepValid(currentStep, data)) return;
    const i = FLOW.indexOf(currentStep);
    if (i < FLOW.length - 1) {
      setDirection(1);
      setStep(FLOW[i + 1]);
    }
  }, [currentStep, data, setStep]);

  const goBack = () => {
    const i = FLOW.indexOf(currentStep);
    if (i > 0) {
      setDirection(-1);
      setStep(FLOW[i - 1]);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || currentStep === 'welcome' || currentStep === 'review') return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'TEXTAREA' || tag === 'INPUT') return;
      if (!isStepValid(currentStep, data)) return;
      e.preventDefault();
      goNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, data, goNext]);

  const remaining = Math.max(1, PATIENT_STEPS.length - Math.max(0, PATIENT_STEPS.indexOf(currentStep)));
  const meta = currentStep !== 'welcome' && currentStep !== 'review' ? STEP_META[currentStep] : null;
  const valid = isStepValid(currentStep, data);
  const hi = lang === 'hi';

  const renderBody = () => {
    if (currentStep === 'welcome') {
      return (
        <WelcomeScreen
          patientName={data.patient_name}
          sex={data.sex}
          onNameChange={(v) => setField('patient_name', v)}
          onSexChange={(v) => setField('sex', v)}
          onContinue={goNext}
        />
      );
    }

    if (currentStep === 'review' && !isSubmitted) {
      return (
        <ReviewScreen
          data={data}
          lang={lang}
          onBack={goBack}
          onSubmit={() => {
            console.log('Final form data:', JSON.stringify(buildOutput(data), null, 2));
            setIsSubmitted(true);
          }}
        />
      );
    }

    if (currentStep === 'review' && isSubmitted) {
      return (
        <SuccessScreen
          patientName={data.patient_name}
          data={data}
          lang={lang}
          onReset={() => {
            reset();
            setIsSubmitted(false);
          }}
        />
      );
    }

    switch (currentStep) {
      case 'onset':
        return (
          <OnsetScreen
            data={data}
            lang={lang}
            onCurrentAge={(v) => setField('current_age', v)}
            onOnsetAge={(v) => setField('age_hair_loss_began', v)}
            onDuration={(v) => setField('duration', v)}
          />
        );
      case 'history':
        return (
          <HistoryScreen
            data={data}
            lang={lang}
            onFamily={(next) => setField('family_history', next)}
            onTogglePattern={(value: HairLossPattern) => {
              const next = data.pattern.includes(value)
                ? data.pattern.filter((p) => p !== value)
                : [...data.pattern, value];
              setField('pattern', next);
            }}
          />
        );
      case 'health':
        return (
          <HealthScreen
            data={data}
            lang={lang}
            onConditions={(next) => setField('diagnosed_conditions', next)}
            onField={setField}
            onApplyPcosHints={() => {
              patch({
                menstrual_cycle: data.menstrual_cycle ?? 'Irregular',
                adult_acne_oily_skin: data.adult_acne_oily_skin ?? true,
                excess_body_facial_hair: data.excess_body_facial_hair ?? true,
              });
            }}
          />
        );
      case 'lifestyle':
        return (
          <LifestyleScreen
            data={data}
            lang={lang}
            onToggleTrigger={(value: PastSixMonthsTrigger) => {
              const next = data.past_6_months.includes(value)
                ? data.past_6_months.filter((t) => t !== value)
                : [...data.past_6_months, value];
              patch({
                past_6_months: next,
                past_6_months_none: next.length === 0,
              });
            }}
            onNone={() => {
              patch({ past_6_months: [], past_6_months_none: true });
            }}
            onHabits={setNested}
            onAddSheddingTriggers={() => {
              const set = new Set([...data.past_6_months, ...SHEDDING_TRIGGERS]);
              patch({ past_6_months: [...set], past_6_months_none: false });
            }}
          />
        );
      case 'treatments':
        return (
          <TreatmentsScreen
            data={data}
            lang={lang}
            onTriedProducts={(v) => {
              patch({
                tried_products: v,
                products: v ? data.products : structuredClone(UNUSED_PRODUCTS),
              });
            }}
            onTriedProcedures={(v) => {
              patch({
                tried_procedures: v,
                procedures: v ? data.procedures : structuredClone(UNUSED_PROCEDURES),
              });
            }}
            onNested={setNested}
            onField={setField}
          />
        );
      case 'sample':
        return (
          <SampleScreen
            data={data}
            lang={lang}
            onSample={(v) => setField('sample_type', v)}
            onConsent={(v) => setField('consent', v)}
          />
        );
      default:
        return null;
    }
  };

  const showNav = currentStep !== 'welcome' && !(currentStep === 'review');

  return (
    <div className="app-shell">
      <div className="header">
        <div className="header__brand">
          <span className="header__logo">GenoRoot</span>
        </div>
        <div className="header__actions">
          <div className="lang-toggle">
            <button
              className={`lang-toggle__btn ${lang === 'en' ? 'lang-toggle__btn--active' : ''}`}
              onClick={() => setLang('en')}
              type="button"
            >
              EN
            </button>
            <button
              className={`lang-toggle__btn ${lang === 'hi' ? 'lang-toggle__btn--active' : ''}`}
              onClick={() => setLang('hi')}
              type="button"
            >
              HI
            </button>
          </div>
          {currentStep !== 'welcome' && currentStep !== 'review' && (
            <span className="time-badge">~{remaining} left</span>
          )}
        </div>
      </div>

      <ProgressBar currentStep={currentStep} />

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={isSubmitted ? 'success' : currentStep}
          custom={direction}
          initial={{ x: direction > 0 ? 40 : -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction > 0 ? -40 : 40, opacity: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        >
          {meta && (
            <p className="section-header__step">{hi ? meta.titleHi : meta.title}</p>
          )}
          {renderBody()}
          {showNav && (
            <div className="nav-bar">
              <button className="btn btn--secondary" onClick={goBack} type="button">
                {hi ? 'Peeche' : 'Back'}
              </button>
              <button className="btn btn--primary" onClick={goNext} disabled={!valid} type="button">
                {currentStep === 'sample' ? (hi ? 'Review' : 'Review') : hi ? 'Aage' : 'Next'}
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
