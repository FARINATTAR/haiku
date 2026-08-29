import type { IntakeFormData, HabitsData, ProductRow, ProcedureRow, FormStep } from '../types';

export const STEP_META: Record<Exclude<FormStep, 'welcome' | 'review'>, { title: string; titleHi: string }> = {
  onset: { title: 'When it started', titleHi: 'Kab shuru hua' },
  history: { title: 'Family & pattern', titleHi: 'Family aur pattern' },
  health: { title: 'Health', titleHi: 'Health' },
  lifestyle: { title: 'Lifestyle', titleHi: 'Lifestyle' },
  treatments: { title: 'What you have tried', titleHi: 'Kya try kiya' },
  sample: { title: 'Sample & consent', titleHi: 'Sample aur consent' },
};

const defaultHabits: HabitsData = {
  smoking: null,
  alcohol: null,
  hard_water: null,
  hair_wash_frequency: null,
  heating_tools_styling_chemicals: null,
  salon_treatments: null,
};

const defaultProductRow: ProductRow = {
  used: false,
};

const defaultProcedureRow: ProcedureRow = {
  done: false,
};

export const INITIAL_FORM_DATA: IntakeFormData = {
  patient_name: '',
  sex: null,
  current_age: null,

  age_hair_loss_began: null,
  duration: null,
  family_history: [],
  pattern: [],

  diagnosed_conditions: [],
  menstrual_cycle: null,
  pregnancy_related: null,
  adult_acne_oily_skin: null,
  excess_body_facial_hair: null,

  past_6_months: [],
  past_6_months_none: false,
  habits: { ...defaultHabits },

  tried_products: null,
  tried_procedures: null,
  products: {
    'OTC/Medicated Shampoos': { ...defaultProductRow },
    'Hair Oils/Serums': { ...defaultProductRow },
    'Topical Minoxidil': { ...defaultProductRow },
    'Oral Minoxidil': { ...defaultProductRow },
    'Supplements': { ...defaultProductRow },
  },
  procedures: {
    'PRP/GFC/iPRF': { ...defaultProcedureRow },
    'Stem Cells/Exosomes': { ...defaultProcedureRow },
    'Hair Transplant': { ...defaultProcedureRow },
    'Other': { ...defaultProcedureRow },
  },
  past_treatment_side_effects: null,

  sample_type: null,
  consent: null,
};

export const UNUSED_PRODUCTS: IntakeFormData['products'] = {
  'OTC/Medicated Shampoos': { used: false },
  'Hair Oils/Serums': { used: false },
  'Topical Minoxidil': { used: false },
  'Oral Minoxidil': { used: false },
  'Supplements': { used: false },
};

export const UNUSED_PROCEDURES: IntakeFormData['procedures'] = {
  'PRP/GFC/iPRF': { done: false },
  'Stem Cells/Exosomes': { done: false },
  'Hair Transplant': { done: false },
  'Other': { done: false },
};
