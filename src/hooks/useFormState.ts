import { useReducer, useCallback, useEffect } from 'react';
import type { IntakeFormData, FormStep } from '../types';
import { INITIAL_FORM_DATA } from '../lib/formConfig';

const STORAGE_KEY = 'genoroot_intake_draft_v3';

type FormAction =
  | { type: 'SET_FIELD'; field: string; value: unknown }
  | { type: 'SET_NESTED'; path: string[]; value: unknown }
  | { type: 'PATCH'; patch: Partial<IntakeFormData> }
  | { type: 'SET_STEP'; step: FormStep }
  | { type: 'RESET' };

interface FormState {
  data: IntakeFormData;
  currentStep: FormStep;
}

function loadDraft(): FormState | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as FormState;
      if (parsed.data && typeof parsed.currentStep === 'string') {
        return {
          data: { ...INITIAL_FORM_DATA, ...parsed.data },
          currentStep: parsed.currentStep,
        };
      }
    }
  } catch {
    // ignore
  }
  return null;
}

function saveDraft(state: FormState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

function clearDraft() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        data: { ...state.data, [action.field]: action.value },
      };

    case 'PATCH':
      return {
        ...state,
        data: { ...state.data, ...action.patch },
      };

    case 'SET_NESTED': {
      const newData = { ...state.data };
      let current: Record<string, unknown> = newData as unknown as Record<string, unknown>;

      for (let i = 0; i < action.path.length - 1; i++) {
        const key = action.path[i];
        current[key] = { ...(current[key] as Record<string, unknown>) };
        current = current[key] as Record<string, unknown>;
      }

      current[action.path[action.path.length - 1]] = action.value;

      return { ...state, data: newData };
    }

    case 'SET_STEP':
      return { ...state, currentStep: action.step };

    case 'RESET':
      clearDraft();
      return { data: structuredClone(INITIAL_FORM_DATA), currentStep: 'welcome' };

    default:
      return state;
  }
}

function getInitialState(): FormState {
  const draft = loadDraft();
  if (draft) return draft;
  return { data: structuredClone(INITIAL_FORM_DATA), currentStep: 'welcome' };
}

export function useFormState() {
  const [state, dispatch] = useReducer(formReducer, undefined, getInitialState);

  useEffect(() => {
    saveDraft(state);
  }, [state]);

  const setField = useCallback((field: string, value: unknown) => {
    dispatch({ type: 'SET_FIELD', field, value });
  }, []);

  const setNested = useCallback((path: string[], value: unknown) => {
    dispatch({ type: 'SET_NESTED', path, value });
  }, []);

  const patch = useCallback((next: Partial<IntakeFormData>) => {
    dispatch({ type: 'PATCH', patch: next });
  }, []);

  const setStep = useCallback((step: FormStep) => {
    dispatch({ type: 'SET_STEP', step });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    data: state.data,
    currentStep: state.currentStep,
    setField,
    setNested,
    patch,
    setStep,
    reset,
  };
}
