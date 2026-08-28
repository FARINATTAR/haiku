import type { Section, IntakeFormData, HabitsData, ProductRow, ProcedureRow } from '../types';

// Section definitions for navigation
export const SECTIONS: Section[] = [
  {
    id: 'A',
    title: 'Hair Loss History',
    icon: '',
    questionRange: [1, 4],
  },
  {
    id: 'B',
    title: 'Health & Hormones',
    icon: '',
    questionRange: [5, 9],
  },
  {
    id: 'C',
    title: 'Lifestyle',
    icon: '',
    questionRange: [10, 11],
  },
  {
    id: 'D',
    title: 'Treatments',
    icon: '',
    questionRange: [12, 14],
  },
  {
    id: 'E',
    title: 'Sample & Consent',
    icon: '',
    questionRange: [15, 16],
  },
];

// Default habits state
const defaultHabits: HabitsData = {
  smoking: null,
  alcohol: null,
  hard_water: null,
  hair_wash_frequency: null,
  heating_tools_styling_chemicals: null,
  salon_treatments: null,
};

// Default product row
const defaultProductRow: ProductRow = {
  used: false,
};

// Default procedure row
const defaultProcedureRow: ProcedureRow = {
  done: false,
};

// Initial form state
export const INITIAL_FORM_DATA: IntakeFormData = {
  patient_name: '',
  sex: null,

  // Section A
  age_hair_loss_began: null,
  duration: null,
  family_history: [],
  pattern: [],

  // Section B
  diagnosed_conditions: [],
  menstrual_cycle: null,
  pregnancy_related: null,
  adult_acne_oily_skin: null,
  excess_body_facial_hair: null,

  // Section C
  past_6_months: [],
  habits: { ...defaultHabits },

  // Section D
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

  // Section E
  sample_type: null,
  consent: null,
};

// Human-readable labels for questions
export const QUESTION_LABELS: Record<number, string> = {
  1: 'At what age did you first notice hair loss?',
  2: 'How long have you been experiencing hair loss?',
  3: 'Does anyone in your family have hair loss?',
  4: 'What pattern of hair loss do you notice?',
  5: 'Have you been diagnosed with any of these conditions?',
  6: 'How would you describe your menstrual cycle?',
  7: 'Any pregnancy-related changes?',
  8: 'Do you experience acne or oily skin?',
  9: 'Do you notice excess body or facial hair growth?',
  10: 'Have you experienced any of these in the past 6 months?',
  11: 'Tell us about your daily habits',
  12: 'What hair care products have you tried?',
  13: 'Have you had any in-clinic procedures?',
  14: 'Any side effects from past treatments?',
  15: 'Which sample type do you prefer for testing?',
  16: 'Consent for sample collection & genetic analysis',
};

// Question subtitles for context
export const QUESTION_SUBTITLES: Record<number, string> = {
  1: 'An approximate age is fine',
  2: 'Since you first noticed thinning or shedding',
  3: 'Select all that apply',
  4: 'Select all areas where you notice changes',
  5: 'Select all that apply, or None',
  6: 'This helps us understand hormonal factors',
  7: 'Hormonal changes during/after pregnancy can affect hair',
  8: 'These can indicate hormonal imbalance',
  9: 'This may suggest elevated androgen levels',
  10: 'These are common triggers for hair loss',
  11: 'Lifestyle habits that may affect hair health',
  12: 'Toggle products you\'ve used and tell us more',
  13: 'Toggle procedures you\'ve had done',
  14: 'Any negative reactions to treatments',
  15: 'For genetic analysis of hair loss factors',
  16: 'Required to proceed with testing',
};
