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

// Patient-friendly helper text for medical terms
export const QUESTION_HELPERS: Record<number, string> = {
  4: 'Look in the mirror — where do you see the most change? Crown is the top-back area of your head.',
  5: 'If a doctor ever told you about any of these in a test report or check-up, select it here.',
  9: 'For example, thick hair on the upper lip, chin, or chest area.',
  11: 'Hard water is water that leaves white residue on taps or makes hair feel dry and rough after washing.',
  12: 'Minoxidil is a hair-growth liquid/foam — common brands include Tugain, Morr, Rogaine.',
  13: 'PRP/GFC means blood is drawn and processed, then injected into the scalp to help hair growth.',
  15: 'Saliva is painless — just spit into a tube. Blood requires a small needle prick.',
};

// Hinglish translations for natural Indian clinic flow
export const QUESTION_LABELS_HINGLISH: Record<number, string> = {
  1: 'Kis age me baal jhadna shuru hue the?',
  2: 'Kitne time se hair fall ho raha hai?',
  3: 'Family me kisi aur ko bhi hair loss ki problem hai?',
  4: 'Baal kahan se jyada kam ho rahe hain?',
  5: 'Kya inme se koi health condition diagnose hui hai?',
  6: 'Aapka menstrual cycle kaisa rehta hai?',
  7: 'Kya recent pregnancy ya postpartum changes hain?',
  8: 'Kya acne ya jyada oily skin ki problem rehti hai?',
  9: 'Kya chehre ya body pe extra hair growth notice kiya?',
  10: 'Pichle 6 months me inme se kuch hua hai?',
  11: 'Aapki daily habits aur routine kaisa hai?',
  12: 'Kaunse hair products ya medicines use kiye hain?',
  13: 'Kya koi clinic procedure karwaya hai?',
  14: 'Kya kisi treatment se koi side effect hua tha?',
  15: 'Testing ke liye kaunsa sample prefer karenge?',
  16: 'Sample collection aur genetic analysis ki consent',
};

export const QUESTION_SUBTITLES_HINGLISH: Record<number, string> = {
  1: 'Approximate umar chalegi',
  2: 'Jabse pehli baar thinning ya shedding notice hui',
  3: 'Jo bhi apply hota ho select karein',
  4: 'Aapke baal kis hisse se kam ho rahe hain',
  5: 'Jo bhi applicable ho select karein, ya None',
  6: 'Isse hormonal factors samajhne me madad milti hai',
  7: 'Pregnancy ke dauran hormones baal ko affect karte hain',
  8: 'Ye hormonal imbalance ka sign ho sakta hai',
  9: 'Ye elevated androgen levels dikha sakta hai',
  10: 'Ye hair loss ke common triggers hote hain',
  11: 'Lifestyle habits jo hair health affect karte hain',
  12: 'Jo use kiya hai toggle karein',
  13: 'Jo procedure karwaya ho toggle karein',
  14: 'Kisi treatment se koi dikkat ya allergy hui ho',
  15: 'Hair loss root-cause analysis ke liye',
  16: 'Testing aage badhane ke liye zaroori hai',
};

export const QUESTION_HELPERS_HINGLISH: Record<number, string> = {
  4: 'Aaine me dekhein — aage ki hairline peeche gayi hai ya beech ki maang chaudi ho rahi hai.',
  5: 'Agar kabhi kisi doctor ne test report me bataya ho, toh select karein.',
  9: 'Jaise upper lip, chin ya chest pe unusually thick hair.',
  11: 'Khara paani (hard water) taps pe safed daag chhodta hai aur baal dry kar deta hai.',
  12: 'Minoxidil hair growth liquid/foam hota hai (e.g. Tugain, Morr, Rogaine).',
  13: 'PRP/GFC me khoon nikaal kar process karke scalp me inject karte hain.',
  15: 'Saliva painless hai (sirf tube me spit karna hai). Blood me injection prick hoga.',
};

