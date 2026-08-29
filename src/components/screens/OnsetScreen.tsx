import type { IntakeFormData, Duration } from '../../types';
import { inferDuration, durationInferenceLabel } from '../../lib/inference';
import { NumberInput } from '../questions/NumberInput';
import { SingleSelect } from '../questions/SingleSelect';
import { VoiceButton } from '../ui/VoiceButton';
import { extractNumberFromVoice } from '../../lib/voiceMatcher';

interface OnsetScreenProps {
  data: IntakeFormData;
  lang: 'en' | 'hi';
  onCurrentAge: (v: number | null) => void;
  onOnsetAge: (v: number | null) => void;
  onDuration: (v: Duration) => void;
}

const DURATION_OPTIONS = [
  { value: 'Less than 6 months', label: 'Under 6 months' },
  { value: '6-12 months', label: '6–12 months' },
  { value: 'Over a year', label: 'Over a year' },
];

export function OnsetScreen({ data, lang, onCurrentAge, onOnsetAge, onDuration }: OnsetScreenProps) {
  const hi = lang === 'hi';
  const inferred =
    data.current_age !== null && data.age_hair_loss_began !== null
      ? inferDuration(data.current_age, data.age_hair_loss_began)
      : null;

  return (
    <div className="screen-stack">
      <div className="question">
        <p className="question__label">{hi ? 'Aapki umar kya hai?' : 'How old are you?'}</p>
        <p className="question__subtitle">{hi ? 'Sirf duration samajhne ke liye' : 'Used to estimate how long this has been going on'}</p>
        <NumberInput
          value={data.current_age}
          onChange={(v) => {
            onCurrentAge(v);
            if (v !== null && data.age_hair_loss_began !== null) {
              const d = inferDuration(v, data.age_hair_loss_began);
              if (d) onDuration(d);
            }
          }}
          min={12}
          max={90}
          unit={hi ? 'saal' : 'years old'}
          autoFocus
        />
        <div className="voice-row">
          <VoiceButton
            onResult={(text) => {
              const n = extractNumberFromVoice(text);
              if (n && n >= 12 && n <= 90) {
                onCurrentAge(n);
                if (data.age_hair_loss_began !== null) {
                  const d = inferDuration(n, data.age_hair_loss_began);
                  if (d) onDuration(d);
                }
              }
            }}
          />
        </div>
      </div>

      <div className="question">
        <p className="question__label">{hi ? 'Pehli baar kab notice kiya?' : 'About what age did you first notice hair loss?'}</p>
        <p className="question__subtitle">{hi ? 'Approximate chalegi' : 'An approximate age is fine'}</p>
        <NumberInput
          value={data.age_hair_loss_began}
          onChange={(v) => {
            onOnsetAge(v);
            if (v !== null && data.current_age !== null) {
              const d = inferDuration(data.current_age, v);
              if (d) onDuration(d);
            }
          }}
          min={1}
          max={80}
          unit={hi ? 'saal ki umar' : 'years old then'}
        />
        <div className="voice-row">
          <VoiceButton
            onResult={(text) => {
              const n = extractNumberFromVoice(text);
              if (n && n >= 1 && n <= 80) {
                onOnsetAge(n);
                if (data.current_age !== null) {
                  const d = inferDuration(data.current_age, n);
                  if (d) onDuration(d);
                }
              }
            }}
          />
        </div>
      </div>

      {inferred && data.duration && data.current_age !== null && data.age_hair_loss_began !== null && (
        <p className="infer-banner">{durationInferenceLabel(data.current_age, data.age_hair_loss_began, data.duration)}</p>
      )}

      <div className="question">
        <p className="question__label">{hi ? 'Kitne time se?' : 'How long has it been going on?'}</p>
        <SingleSelect
          options={DURATION_OPTIONS}
          value={data.duration}
          onChange={(v) => onDuration(v as Duration)}
        />
      </div>
    </div>
  );
}
