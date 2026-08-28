import { useReducer, useCallback } from 'react';
import type { IntakeFormData, FormStep } from '../types';
import { INITIAL_FORM_DATA } from '../lib/formConfig';

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
      return { data: { ...INITIAL_FORM_DATA }, currentStep: 'welcome' };

    default:
      return state;
  }
}

export function useFormState() {
  const [state, dispatch] = useReducer(formReducer, {
    data: { ...INITIAL_FORM_DATA },
    currentStep: 'welcome' as FormStep,
  });

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
