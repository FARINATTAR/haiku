import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormState } from '../hooks/useFormState';
import type { FormStep, IntakeFormData, FamilyHistory, DiagnosedCondition, Duration, HairLossPattern, MenstrualCycle, PregnancyRelated, SampleType } from '../types';
import { SECTIONS, QUESTION_LABELS, QUESTION_SUBTITLES } from '../lib/formConfig';
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

const STEP_ORDER: FormStep[] = ['welcome', 'A', 'B', 'C', 'D', 'E', 'review'];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -100 : 100,
    opacity: 0,
  }),
};

export function IntakeForm() {
  const { data, currentStep, setField, setNested, toggleArrayItem, setStep, reset } = useFormState();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentIndex = STEP_ORDER.indexOf(currentStep);

  const goNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < STEP_ORDER.length) {
      setStep(STEP_ORDER[nextIndex]);
    }
  };

  const goBack = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setStep(STEP_ORDER[prevIndex]);
    }
  };

  const renderQuestion = (num: number) => {
    const label = QUESTION_LABELS[num];
    const subtitle = QUESTION_SUBTITLES[num];

    return (
      <div className="question" key={num}>
        <h3 className="question__label">{label}</h3>
        {subtitle && <p className="question__subtitle">{subtitle}</p>}
        {renderQuestionInput(num)}
      </div>
    );
  };

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
                  setField(
                    'family_history',
                    without.filter((f) => f !== v)
                  );
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
                  setField(
                    'diagnosed_conditions',
                    without.filter((f) => f !== v)
                  );
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
          />
        );

      case 8:
        return (
          <YesNoToggle
            value={data.adult_acne_oily_skin}
            onChange={(v) => setField('adult_acne_oily_skin', v)}
          />
        );

      case 9:
        return (
          <YesNoToggle
            value={data.excess_body_facial_hair}
            onChange={(v) => setField('excess_body_facial_hair', v)}
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
        return (
          <HabitsTable
            habits={data.habits}
            onChange={setNested}
          />
        );

      case 12:
        return (
          <ProductTable
            products={data.products}
            onChange={setNested}
          />
        );

      case 13:
        return (
          <ProcedureTable
            procedures={data.procedures}
            onChange={setNested}
          />
        );

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
              style={{
                color: data.consent === true ? 'var(--accent)' : 'var(--text-muted)',
              }}
            >
              {data.consent === true ? 'Consent given' : 'Tap to agree'}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const renderSectionContent = (sectionId: string) => {
    const section = SECTIONS.find((s) => s.id === sectionId);
    if (!section) return null;

    const [start, end] = section.questionRange;
    const questions: number[] = [];

    for (let i = start; i <= end; i++) {
      // Skip female-only questions for non-female patients
      if ((i === 6 || i === 7) && data.sex !== 'female') continue;
      questions.push(i);
    }

    return (
      <>
        <div className="section-header">
          <p className="section-header__step">
            Section {section.id} of 5
          </p>
          <h2 className="section-header__title">{section.title}</h2>
        </div>

        <div className="form-content">
          {questions.map((q) => renderQuestion(q))}
        </div>
      </>
    );
  };

  const direction = 1;

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
      <ProgressBar currentStep={currentStep} />

      {/* Content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25, ease: 'easeOut' }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        >
          {currentStep === 'welcome' && (
            <WelcomeScreen
              patientName={data.patient_name}
              sex={data.sex}
              onNameChange={(v) => setField('patient_name', v)}
              onSexChange={(v) => setField('sex', v)}
              onContinue={goNext}
            />
          )}

          {currentStep === 'review' && !isSubmitted && (
            <ReviewScreen
              data={data}
              onBack={goBack}
              onSubmit={() => {
                console.log('Final form data:', JSON.stringify(buildOutput(data), null, 2));
                setIsSubmitted(true);
              }}
            />
          )}

          {currentStep === 'review' && isSubmitted && (
            <SuccessScreen
              patientName={data.patient_name}
              onReset={() => {
                reset();
                setIsSubmitted(false);
              }}
            />
          )}

          {currentStep !== 'welcome' && currentStep !== 'review' && (
            <>{renderSectionContent(currentStep)}</>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {currentStep !== 'welcome' && currentStep !== 'review' && (
        <div className="nav-bar">
          <button className="btn btn--secondary" onClick={goBack} type="button">
            ← Back
          </button>
          <button className="btn btn--primary" onClick={goNext} type="button">
            {currentStep === 'E' ? 'Review →' : 'Continue →'}
          </button>
        </div>
      )}
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
