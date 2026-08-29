import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormState } from '../hooks/useFormState';
import type { IntakeFormData, FamilyHistory, DiagnosedCondition, Duration, HairLossPattern, MenstrualCycle, PregnancyRelated, SampleType } from '../types';
import { SECTIONS, QUESTION_LABELS, QUESTION_SUBTITLES, QUESTION_HELPERS, QUESTION_LABELS_HINGLISH, QUESTION_SUBTITLES_HINGLISH, QUESTION_HELPERS_HINGLISH } from '../lib/formConfig';
import { ProgressBar } from './ProgressBar';
import { WelcomeScreen } from './WelcomeScreen';
import { ReviewScreen } from './ReviewScreen';
import { SuccessScreen } from './SuccessScreen';
import { NumberInput } from './questions/NumberInput';
import { SingleSelect } from './questions/SingleSelect';
import { MultiSelect } from './questions/MultiSelect';
import { YesNoToggle } from './questions/YesNoToggle';
import { HabitsTable } from './questions/HabitsTable';
import { ProductTable } from './questions/ProductTable';
import { ProcedureTable } from './questions/ProcedureTable';
import { ScalpPhotoUpload } from './questions/ScalpPhotoUpload';
import { VoiceButton } from './ui/VoiceButton';
import { matchVoiceToOption, extractNumberFromVoice, parseDurationVoice } from '../lib/voiceMatcher';

const REVIEW_STEP = 17;

function isStepValid(step: number, data: IntakeFormData): boolean {
  switch (step) {
    case 0:
      return data.patient_name.trim().length > 0 && data.sex !== null;
    case 1:
      return data.age_hair_loss_began !== null && data.age_hair_loss_began >= 1 && data.age_hair_loss_began <= 99;
    case 2:
      return data.duration !== null;
    case 3:
      return data.family_history.length > 0;
    case 4:
      return data.pattern.length > 0;
    case 5:
      return data.diagnosed_conditions.length > 0;
    case 6:
      return data.menstrual_cycle !== null;
    case 7:
      return data.pregnancy_related !== null;
    case 8:
      return data.adult_acne_oily_skin !== null;
    case 9:
      return data.excess_body_facial_hair !== null;
    case 10:
      return true; // past 6 months events (can be empty if none happened)
    case 11:
      return true; // habits table has defaults
    case 12:
      return true; // product table optional
    case 13:
      return true; // procedure table optional
    case 14:
      return data.past_treatment_side_effects !== null;
    case 15:
      return data.sample_type !== null;
    case 16:
      return data.consent === true;
    default:
      return true;
  }
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

// Get the section context for a question number
function getSectionForQuestion(qNum: number): { id: string; title: string } | null {
  for (const section of SECTIONS) {
    const [start, end] = section.questionRange;
    if (qNum >= start && qNum <= end) {
      return { id: section.id, title: section.title };
    }
  }
  return null;
}

export function IntakeForm() {
  const { data, currentStep, setField, setNested, toggleArrayItem, setStep, reset } = useFormState();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [direction, setDirection] = useState(1);
  const [scalpPhoto, setScalpPhoto] = useState<File | null>(null);
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  // Build the active question list, skipping Q6/Q7 for non-female
  const questionList = useMemo(() => {
    const list: number[] = [];
    for (let i = 1; i <= 16; i++) {
      if ((i === 6 || i === 7) && data.sex !== 'female') continue;
      list.push(i);
    }
    return list;
  }, [data.sex]);

  const totalQuestions = questionList.length;

  const goNext = useCallback(() => {
    if (currentStep >= 1 && currentStep <= 16 && !isStepValid(currentStep, data)) {
      return;
    }
    setDirection(1);
    if (currentStep === 0) {
      setStep(questionList[0]);
    } else if (currentStep >= 1 && currentStep <= 16) {
      const idx = questionList.indexOf(currentStep);
      if (idx < questionList.length - 1) {
        setStep(questionList[idx + 1]);
      } else {
        setStep(REVIEW_STEP);
      }
    }
  }, [currentStep, data, questionList, setStep]);

  const goBack = () => {
    setDirection(-1);
    if (currentStep === REVIEW_STEP) {
      setStep(questionList[questionList.length - 1]);
    } else if (currentStep >= 1 && currentStep <= 16) {
      const idx = questionList.indexOf(currentStep);
      if (idx > 0) {
        setStep(questionList[idx - 1]);
      } else {
        setStep(0);
      }
    }
  };

  // Enter key navigates to next question
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && currentStep >= 1 && currentStep <= 16) {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === 'TEXTAREA') return;
        if (!isStepValid(currentStep, data)) return;
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, data, goNext]);

  const renderQuestionInput = (num: number) => {
    switch (num) {
      case 1:
        return (
          <NumberInput
            value={data.age_hair_loss_began}
            onChange={(v) => setField('age_hair_loss_began', v)}
            min={1}
            max={80}
            unit="years old"
          />
        );

      case 2:
        return (
          <SingleSelect
            options={[
              { value: 'Less than 6 months', label: 'Under 6 months', desc: 'Recent onset or sudden acute shedding' },
              { value: '6-12 months', label: '6–12 months', desc: 'Moderate duration (months of thinning)' },
              { value: 'Over a year', label: 'Over a year', desc: 'Long-term progressive gradual hair loss' },
            ]}
            value={data.duration}
            onChange={(v) => setField('duration', v as Duration)}
            onAutoAdvance={goNext}
          />
        );

      case 3:
        return (
          <MultiSelect
            options={[
              { value: 'Father had hair loss', label: 'Father', desc: 'Receding hairline or crown balding' },
              { value: 'Mother had hair loss', label: 'Mother', desc: 'Widening part or overall crown thinning' },
              { value: 'Siblings with thinning or baldness', label: 'Siblings', desc: 'Brother or sister with hair thinning' },
              { value: 'Other relative with hair loss', label: 'Other relative', desc: 'Grandparents, uncles or aunts' },
              { value: 'No known family history', label: 'None that I know of', desc: 'No close relatives with hair loss history' },
            ]}
            selected={data.family_history}
            onToggle={(val) => {
              const v = val as FamilyHistory;
              if (v === 'No known family history') {
                if (data.family_history.includes(v)) {
                  setField('family_history', []);
                } else {
                  setField('family_history', [v]);
                }
              } else {
                const without = data.family_history.filter((f) => f !== 'No known family history');
                if (without.includes(v)) {
                  setField('family_history', without.filter((f) => f !== v));
                } else {
                  setField('family_history', [...without, v]);
                }
              }
            }}
          />
        );

      case 4:
        return (
          <MultiSelect
            options={[
              {
                value: 'Receding hairline',
                label: 'Receding hairline',
                desc: 'Temples or forehead moving backward',
                info: 'Hairline is progressively moving back from the forehead and sides, forming an M or V pattern.',
              },
              {
                value: 'Thinning at crown',
                label: 'Thinning at crown',
                desc: 'Vertex or top-back of head',
                info: 'Noticeable reduction in hair density or visible bald patch at the top-back vertex area.',
              },
              {
                value: 'Widening part line',
                label: 'Widening part line',
                desc: 'Central parting looking broader',
                info: 'The central line where your hair naturally separates looks broader with more scalp exposed.',
              },
              {
                value: 'Diffuse thinning',
                label: 'Diffuse thinning',
                desc: 'Overall hair loss all across the scalp',
                info: 'Uniform reduction in hair volume and thickness all across your head without specific patches.',
              },
              {
                value: 'Patchy loss',
                label: 'Patchy loss',
                desc: 'Smooth coin-shaped bald spots',
                info: 'Round, smooth coin-sized bald spots that appear suddenly (characteristic of Alopecia Areata).',
              },
              {
                value: 'Sudden excessive shedding',
                label: 'Sudden excessive shedding',
                desc: 'Losing handfuls/clumps in shower',
                info: 'Rapid large-volume shedding triggered 2-3 months after illness, fever, crash diet, or stress.',
              },
            ]}
            selected={data.pattern}
            onToggle={(v) => toggleArrayItem('pattern', v as HairLossPattern)}
          />
        );

      case 5:
        return (
          <MultiSelect
            options={[
              {
                value: 'PCOS/PCOD',
                label: 'PCOS / PCOD',
                desc: 'Polycystic Ovary Syndrome',
                info: 'Elevated androgens and insulin resistance cause hair follicle miniaturization.',
              },
              {
                value: 'Thyroid disorder',
                label: 'Thyroid disorder',
                desc: 'Hypo or Hyper-thyroidism',
                info: 'Thyroid hormone imbalance disrupts the hair growth cycle, causing brittle shedding.',
              },
              {
                value: 'Diabetes',
                label: 'Diabetes',
                desc: 'High blood sugar / insulin resistance',
                info: 'High blood sugar impairs micro-capillary circulation supplying nutrients to hair roots.',
              },
              {
                value: 'Autoimmune disease',
                label: 'Autoimmune disease',
                desc: 'e.g. Hashimoto, Lupus, Rheumatoid',
                info: 'The immune system mistakenly targets and inflames hair follicle tissues.',
              },
              {
                value: 'Anemia',
                label: 'Anemia / Low Ferritin',
                desc: 'Iron deficiency',
                info: 'Iron & ferritin are essential co-factors for hair matrix cell proliferation.',
              },
              {
                value: 'None',
                label: 'None of these',
                desc: 'No known diagnosed health conditions',
              },
            ]}
            selected={data.diagnosed_conditions}
            onToggle={(val) => {
              const v = val as DiagnosedCondition;
              if (v === 'None') {
                if (data.diagnosed_conditions.includes(v)) {
                  setField('diagnosed_conditions', []);
                } else {
                  setField('diagnosed_conditions', [v]);
                }
              } else {
                const without = data.diagnosed_conditions.filter((f) => f !== 'None');
                if (without.includes(v)) {
                  setField('diagnosed_conditions', without.filter((f) => f !== v));
                } else {
                  setField('diagnosed_conditions', [...without, v]);
                }
              }
            }}
          />
        );

      case 6:
        return (
          <SingleSelect
            options={[
              { value: 'Regular', label: 'Regular' },
              { value: 'Irregular', label: 'Irregular' },
              { value: 'Menopausal', label: 'Menopausal' },
              { value: 'Not applicable', label: 'Not applicable' },
            ]}
            value={data.menstrual_cycle}
            onChange={(v) => setField('menstrual_cycle', v as MenstrualCycle)}
            onAutoAdvance={goNext}
          />
        );

      case 7:
        return (
          <SingleSelect
            options={[
              { value: 'Currently pregnant', label: 'Currently pregnant' },
              { value: 'Postpartum <1 year', label: 'Postpartum (under 1 year)' },
              { value: 'Not applicable', label: 'Not applicable' },
            ]}
            value={data.pregnancy_related}
            onChange={(v) => setField('pregnancy_related', v as PregnancyRelated)}
            onAutoAdvance={goNext}
          />
        );

      case 8:
        return (
          <YesNoToggle
            value={data.adult_acne_oily_skin}
            onChange={(v) => setField('adult_acne_oily_skin', v)}
            onAutoAdvance={goNext}
          />
        );

      case 9:
        return (
          <YesNoToggle
            value={data.excess_body_facial_hair}
            onChange={(v) => setField('excess_body_facial_hair', v)}
            onAutoAdvance={goNext}
          />
        );

      case 10:
        return (
          <MultiSelect
            options={[
              { value: 'Crash dieting or major weight loss', label: 'Crash diet / weight loss' },
              { value: 'High stress or emotional trauma', label: 'High stress / emotional trauma' },
              { value: 'Fever with illness (COVID, Dengue, Typhoid)', label: 'Fever or illness (COVID, Dengue, Typhoid)' },
              { value: 'Recent surgery', label: 'Recent surgery' },
              { value: 'Change in location/water/air quality', label: 'Change in location or water quality' },
            ]}
            selected={data.past_6_months}
            onToggle={(v) => toggleArrayItem('past_6_months', v)}
          />
        );

      case 11:
        return <HabitsTable habits={data.habits} onChange={setNested} />;

      case 12:
        return <ProductTable products={data.products} onChange={setNested} />;

      case 13:
        return <ProcedureTable procedures={data.procedures} onChange={setNested} />;

      case 14:
        return (
          <div>
            <YesNoToggle
              value={data.past_treatment_side_effects}
              onChange={(v) => setField('past_treatment_side_effects', v)}
            />
            <AnimatePresence>
              {data.past_treatment_side_effects === true && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ marginTop: 12 }}
                >
                  <textarea
                    className="text-input"
                    placeholder="Please describe the side effects you experienced..."
                    value={data.past_treatment_side_effects_describe || ''}
                    onChange={(e) => setField('past_treatment_side_effects_describe', e.target.value)}
                  />
                  <VoiceButton
                    onResult={(text) => {
                      const current = data.past_treatment_side_effects_describe || '';
                      setField('past_treatment_side_effects_describe', current ? `${current} ${text}` : text);
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );

      case 15:
        return (
          <SingleSelect
            options={[
              { value: 'Saliva', label: 'Saliva sample · Recommended' },
              { value: 'Blood', label: 'Blood sample' },
              { value: 'Either', label: 'Either is fine' },
            ]}
            value={data.sample_type}
            onChange={(v) => setField('sample_type', v as SampleType)}
            onAutoAdvance={goNext}
          />
        );

      case 16:
        return (
          <div className="consent-card">
            <p className="consent-card__text">
              I consent to the collection of a biological sample (saliva or blood) for the purpose of
              genetic analysis related to hair and scalp health. I understand the results will be used
              to inform my treatment plan at GenoRoot Hair & Scalp.
            </p>
            <div
              className={`consent-card__check ${data.consent === true ? 'consent-card__check--agreed' : ''}`}
              onClick={() => setField('consent', data.consent === true ? null : true)}
            >
              {data.consent === true ? '✓' : ''}
            </div>
            <p
              className="consent-card__status"
              style={{ color: data.consent === true ? 'var(--accent)' : 'var(--text-muted)' }}
            >
              {data.consent === true ? 'Consent given' : 'Tap to agree'}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const handleVoiceAnswer = (qNum: number, text: string) => {
    if (!text) return;
    switch (qNum) {
      case 1: {
        const num = extractNumberFromVoice(text);
        if (num && num >= 1 && num <= 80) {
          setField('age_hair_loss_began', num);
          setTimeout(() => goNext(), 400);
        }
        break;
      }
      case 2: {
        const durationMatch = parseDurationVoice(text);
        if (durationMatch) {
          setField('duration', durationMatch);
          setTimeout(() => goNext(), 400);
        }
        break;
      }
      case 3: {
        const opt = matchVoiceToOption(text, [
          { value: 'Father had hair loss', label: 'Father' },
          { value: 'Mother had hair loss', label: 'Mother' },
          { value: 'Siblings with thinning or baldness', label: 'Siblings' },
          { value: 'Other relative with hair loss', label: 'Other relative' },
          { value: 'No known family history', label: 'None' },
        ]);
        if (opt) {
          if (opt === 'No known family history') {
            setField('family_history', ['No known family history']);
          } else {
            const withoutNone = data.family_history.filter((f) => f !== 'No known family history');
            if ((withoutNone as string[]).includes(opt)) {
              setField('family_history', withoutNone.filter((f) => f !== opt));
            } else {
              setField('family_history', [...withoutNone, opt as FamilyHistory]);
            }
          }
        }
        break;
      }
      case 4: {
        const opt = matchVoiceToOption(text, [
          { value: 'Receding hairline', label: 'Receding hairline' },
          { value: 'Thinning at crown', label: 'Thinning at crown' },
          { value: 'Widening part line', label: 'Widening part' },
          { value: 'Diffuse thinning', label: 'Overall thinning' },
          { value: 'Patchy loss', label: 'Patchy loss' },
          { value: 'Sudden excessive shedding', label: 'Excessive shedding' },
        ]);
        if (opt) {
          toggleArrayItem('pattern', opt);
        }
        break;
      }
      case 5: {
        const opt = matchVoiceToOption(text, [
          { value: 'PCOS/PCOD', label: 'PCOS PCOD' },
          { value: 'Thyroid disorder', label: 'Thyroid' },
          { value: 'Diabetes', label: 'Diabetes' },
          { value: 'Autoimmune disease', label: 'Autoimmune' },
          { value: 'Anemia', label: 'Anemia' },
          { value: 'None', label: 'None' },
        ]);
        if (opt) {
          if (opt === 'None') {
            setField('diagnosed_conditions', ['None']);
          } else {
            const withoutNone = data.diagnosed_conditions.filter((f) => f !== 'None');
            if ((withoutNone as string[]).includes(opt)) {
              setField('diagnosed_conditions', withoutNone.filter((f) => f !== opt));
            } else {
              setField('diagnosed_conditions', [...withoutNone, opt as DiagnosedCondition]);
            }
          }
        }
        break;
      }
      case 6: {
        const opt = matchVoiceToOption(text, [
          { value: 'Regular', label: 'Regular' },
          { value: 'Irregular', label: 'Irregular' },
          { value: 'Menopausal', label: 'Menopausal' },
          { value: 'Not applicable', label: 'Not applicable' },
        ]);
        if (opt) {
          setField('menstrual_cycle', opt as MenstrualCycle);
          setTimeout(() => goNext(), 400);
        }
        break;
      }
      case 7: {
        const opt = matchVoiceToOption(text, [
          { value: 'Currently pregnant', label: 'Currently pregnant' },
          { value: 'Postpartum <1 year', label: 'Postpartum' },
          { value: 'Not applicable', label: 'Not applicable' },
        ]);
        if (opt) {
          setField('pregnancy_related', opt as PregnancyRelated);
          setTimeout(() => goNext(), 400);
        }
        break;
      }
      case 8: {
        const isYes = text.toLowerCase().includes('yes') || text.toLowerCase().includes('ha') || text.toLowerCase().includes('haan');
        const isNo = text.toLowerCase().includes('no') || text.toLowerCase().includes('na') || text.toLowerCase().includes('nahi');
        if (isYes) { setField('adult_acne_oily_skin', true); setTimeout(() => goNext(), 400); }
        else if (isNo) { setField('adult_acne_oily_skin', false); setTimeout(() => goNext(), 400); }
        break;
      }
      case 9: {
        const isYes = text.toLowerCase().includes('yes') || text.toLowerCase().includes('ha') || text.toLowerCase().includes('haan');
        const isNo = text.toLowerCase().includes('no') || text.toLowerCase().includes('na') || text.toLowerCase().includes('nahi');
        if (isYes) { setField('excess_body_facial_hair', true); setTimeout(() => goNext(), 400); }
        else if (isNo) { setField('excess_body_facial_hair', false); setTimeout(() => goNext(), 400); }
        break;
      }
      case 15: {
        const opt = matchVoiceToOption(text, [
          { value: 'Saliva', label: 'Saliva' },
          { value: 'Blood', label: 'Blood' },
          { value: 'Either', label: 'Either' },
        ]);
        if (opt) {
          setField('sample_type', opt as SampleType);
          setTimeout(() => goNext(), 400);
        }
        break;
      }
      case 16: {
        const isAgree = text.toLowerCase().includes('yes') || text.toLowerCase().includes('agree') || text.toLowerCase().includes('haan') || text.toLowerCase().includes('consent');
        if (isAgree) {
          setField('consent', true);
          setTimeout(() => goNext(), 400);
        }
        break;
      }
      default:
        break;
    }
  };

  const renderQuestionScreen = (qNum: number) => {
    const section = getSectionForQuestion(qNum);
    const label = lang === 'hi' ? (QUESTION_LABELS_HINGLISH[qNum] || QUESTION_LABELS[qNum]) : QUESTION_LABELS[qNum];
    const subtitle = lang === 'hi' ? (QUESTION_SUBTITLES_HINGLISH[qNum] || QUESTION_SUBTITLES[qNum]) : QUESTION_SUBTITLES[qNum];
    const helper = lang === 'hi' ? (QUESTION_HELPERS_HINGLISH[qNum] || QUESTION_HELPERS[qNum]) : QUESTION_HELPERS[qNum];
    const isLastQuestion = questionList.indexOf(qNum) === questionList.length - 1;
    const isCurrentValid = isStepValid(qNum, data);

    return (
      <>
        {section && (
          <p className="section-header__step">
            {section.title}
          </p>
        )}
        <h2 className="question__label" style={{ fontSize: '1.25rem', marginBottom: 6 }}>
          {label}
        </h2>
        {subtitle && (
          <p className="question__subtitle">{subtitle}</p>
        )}
        {helper && (
          <div className="question__helper">
            <span className="question__helper-icon">i</span>
            <span>{helper}</span>
          </div>
        )}

        <div className="form-content" style={{ marginTop: 8 }}>
          {renderQuestionInput(qNum)}
          {![11, 12, 13, 14].includes(qNum) && (
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
              <VoiceButton onResult={(text) => handleVoiceAnswer(qNum, text)} />
            </div>
          )}
        </div>


        {/* Navigation */}
        <div className="nav-bar">
          <button className="btn btn--secondary" onClick={goBack} type="button">
            {lang === 'hi' ? 'Peeche' : 'Back'}
          </button>
          <button
            className="btn btn--primary"
            onClick={goNext}
            disabled={!isCurrentValid}
            type="button"
          >
            {isLastQuestion ? (lang === 'hi' ? 'Review Karein' : 'Review') : (lang === 'hi' ? 'Aage' : 'Next')}
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="app-shell">
      {/* Header */}
      <div className="header">
        <div className="header__brand">
          <span className="header__logo">GenoRoot</span>
          <span className="header__badge">Hair & Scalp</span>
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
              Hinglish
            </button>
          </div>
          {currentStep >= 1 && currentStep <= 16 && (() => {
            // Estimate remaining time: simple questions ~8s, complex ~25s
            const COMPLEX_QUESTIONS = [11, 12, 13]; // habits, products, procedures
            const remaining = questionList.filter(q => questionList.indexOf(q) >= questionList.indexOf(currentStep));
            const seconds = remaining.reduce((sum, q) => sum + (COMPLEX_QUESTIONS.includes(q) ? 25 : 8), 0);
            const mins = Math.max(1, Math.ceil(seconds / 60));
            return <span className="time-badge">~{mins} min left</span>;
          })()}
        </div>
      </div>

      {/* Progress */}
      <ProgressBar currentStep={currentStep} totalQuestions={totalQuestions} />

      {/* Content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.2, ease: 'easeOut' }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        >
          {/* Welcome */}
          {currentStep === 0 && (
            <WelcomeScreen
              patientName={data.patient_name}
              sex={data.sex}
              onNameChange={(v) => setField('patient_name', v)}
              onSexChange={(v) => setField('sex', v)}
              onContinue={goNext}
            />
          )}

          {/* Review (not submitted) */}
          {currentStep === REVIEW_STEP && !isSubmitted && (
            <>
              <div style={{ marginBottom: 20 }}>
                <p className="section-header__step">Optional</p>
                <h2 className="question__label" style={{ fontSize: '1.1rem', marginBottom: 6 }}>Upload a scalp photo</h2>
                <p className="question__subtitle" style={{ marginBottom: 12 }}>Helps your doctor assess your condition before the visit</p>
                <ScalpPhotoUpload onPhotoChange={setScalpPhoto} currentPhoto={scalpPhoto} />
              </div>
              <ReviewScreen
                data={data}
                onBack={goBack}
                onSubmit={() => {
                  console.log('Final form data:', JSON.stringify(buildOutput(data), null, 2));
                  if (scalpPhoto) console.log('Scalp photo attached:', scalpPhoto.name);
                  setIsSubmitted(true);
                }}
              />
            </>
          )}

          {/* Success */}
          {currentStep === REVIEW_STEP && isSubmitted && (
            <SuccessScreen
              patientName={data.patient_name}
              data={data}
              onReset={() => {
                reset();
                setIsSubmitted(false);
              }}
            />
          )}

          {/* Question */}
          {currentStep >= 1 && currentStep <= 16 && renderQuestionScreen(currentStep)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Build the output JSON matching the schema
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
