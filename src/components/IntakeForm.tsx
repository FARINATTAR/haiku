import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormState } from '../hooks/useFormState';
import type { IntakeFormData, FamilyHistory, DiagnosedCondition, Duration, HairLossPattern, MenstrualCycle, PregnancyRelated, SampleType } from '../types';
import { SECTIONS, QUESTION_LABELS, QUESTION_SUBTITLES, QUESTION_HELPERS } from '../lib/formConfig';
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
import { VoiceButton } from './ui/VoiceButton';

const REVIEW_STEP = 17;

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
  }, [currentStep, questionList, setStep]);

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
        // Don't trigger if user is typing in a textarea
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === 'TEXTAREA') return;
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, goNext]);

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
              { value: 'Less than 6 months', label: 'Under 6 months' },
              { value: '6-12 months', label: '6–12 months' },
              { value: 'Over a year', label: 'Over a year' },
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
              { value: 'Father had hair loss', label: 'Father' },
              { value: 'Mother had hair loss', label: 'Mother' },
              { value: 'Siblings with thinning or baldness', label: 'Siblings' },
              { value: 'No known family history', label: 'None that I know of' },
            ]}
            selected={data.family_history}
            onToggle={(val) => {
              const v = val as FamilyHistory;
              if (v === 'No known family history') {
                if (data.family_history.includes(v)) {
                  toggleArrayItem('family_history', v);
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
              { value: 'Receding hairline', label: 'Receding hairline' },
              { value: 'Thinning at crown', label: 'Thinning at crown' },
              { value: 'Widening part line', label: 'Widening part' },
              { value: 'Diffuse thinning', label: 'Overall thinning' },
              { value: 'Patchy loss', label: 'Patchy loss' },
              { value: 'Sudden excessive shedding', label: 'Excessive shedding' },
            ]}
            selected={data.pattern}
            onToggle={(v) => toggleArrayItem('pattern', v as HairLossPattern)}
          />
        );

      case 5:
        return (
          <MultiSelect
            options={[
              { value: 'PCOS/PCOD', label: 'PCOS / PCOD' },
              { value: 'Thyroid disorder', label: 'Thyroid disorder' },
              { value: 'Diabetes', label: 'Diabetes' },
              { value: 'Autoimmune disease', label: 'Autoimmune disease' },
              { value: 'Anemia', label: 'Anemia' },
              { value: 'None', label: 'None of these' },
            ]}
            selected={data.diagnosed_conditions}
            onToggle={(val) => {
              const v = val as DiagnosedCondition;
              if (v === 'None') {
                if (data.diagnosed_conditions.includes(v)) {
                  toggleArrayItem('diagnosed_conditions', v);
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
              { value: 'Saliva', label: 'Saliva sample' },
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

  const renderQuestionScreen = (qNum: number) => {
    const section = getSectionForQuestion(qNum);
    const label = QUESTION_LABELS[qNum];
    const subtitle = QUESTION_SUBTITLES[qNum];
    const helper = QUESTION_HELPERS[qNum];
    const isLastQuestion = questionList.indexOf(qNum) === questionList.length - 1;

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
        </div>


        {/* Navigation */}
        <div className="nav-bar">
          <button className="btn btn--secondary" onClick={goBack} type="button">
            Back
          </button>
          <button className="btn btn--primary" onClick={goNext} type="button">
            {isLastQuestion ? 'Review' : 'Next'}
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
            <ReviewScreen
              data={data}
              onBack={goBack}
              onSubmit={() => {
                console.log('Final form data:', JSON.stringify(buildOutput(data), null, 2));
                setIsSubmitted(true);
              }}
            />
          )}

          {/* Success */}
          {currentStep === REVIEW_STEP && isSubmitted && (
            <SuccessScreen
              patientName={data.patient_name}
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
