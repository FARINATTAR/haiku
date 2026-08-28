import { useReducer, useCallback, useEffect } from 'react';
import type { IntakeFormData, FormStep } from '../types';
import { INITIAL_FORM_DATA } from '../lib/formConfig';

const STORAGE_KEY = 'genoroot_intake_draft';

type FormAction =
  | { type: 'SET_FIELD'; field: string; value: unknown }
  | { type: 'SET_NESTED'; path: string[]; value: unknown }
  | { type: 'TOGGLE_ARRAY_ITEM'; field: string; item: string }
  | { type: 'SET_STEP'; step: FormStep }
  | { type: 'RESET' };

interface FormState {
  data: IntakeFormData;
  currentStep: FormStep;
}

// Try to load saved draft from localStorage
function loadDraft(): FormState | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as FormState;
      // Basic validation: check if it has the expected shape
      if (parsed.data && typeof parsed.currentStep === 'number') {
        return parsed;
      }
    }
  } catch {
    // Ignore parse errors
  }
  return null;
}

function saveDraft(state: FormState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota errors
  }
}

function clearDraft() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        data: { ...state.data, [action.field]: action.value },
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

    case 'TOGGLE_ARRAY_ITEM': {
      const arr = (state.data[action.field as keyof IntakeFormData] as string[]) || [];
      const newArr = arr.includes(action.item)
        ? arr.filter((i) => i !== action.item)
        : [...arr, action.item];

      return {
        ...state,
        data: { ...state.data, [action.field]: newArr },
      };
    }

    case 'SET_STEP':
      return { ...state, currentStep: action.step };

    case 'RESET':
      clearDraft();
      return { data: { ...INITIAL_FORM_DATA }, currentStep: 0 };

    default:
      return state;
  }
}

function getInitialState(): FormState {
  const draft = loadDraft();
  if (draft) return draft;
  return { data: { ...INITIAL_FORM_DATA }, currentStep: 0 };
}

export function useFormState() {
  const [state, dispatch] = useReducer(formReducer, undefined, getInitialState);

  // Auto-save to localStorage on every state change
  useEffect(() => {
    saveDraft(state);
  }, [state]);

  const setField = useCallback(
    (field: string, value: unknown) => {
      dispatch({ type: 'SET_FIELD', field, value });
    },
    []
  );

  const setNested = useCallback(
    (path: string[], value: unknown) => {
      dispatch({ type: 'SET_NESTED', path, value });
    },
    []
  );

  const toggleArrayItem = useCallback(
    (field: string, item: string) => {
      dispatch({ type: 'TOGGLE_ARRAY_ITEM', field, item });
    },
    []
  );

  const setStep = useCallback(
    (step: FormStep) => {
      dispatch({ type: 'SET_STEP', step });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    []
  );

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    data: state.data,
    currentStep: state.currentStep,
    setField,
    setNested,
    toggleArrayItem,
    setStep,
    reset,
  };
}
