// Types matching intake-schema.json exactly

export type Sex = 'male' | 'female' | 'other';

export type Duration = 'Less than 6 months' | '6-12 months' | 'Over a year';

export type FamilyHistory =
  | 'Father had hair loss'
  | 'Mother had hair loss'
  | 'Siblings with thinning or baldness'
  | 'No known family history';

export type HairLossPattern =
  | 'Receding hairline'
  | 'Thinning at crown'
  | 'Widening part line'
  | 'Diffuse thinning'
  | 'Patchy loss'
  | 'Sudden excessive shedding';

export type DiagnosedCondition =
  | 'PCOS/PCOD'
  | 'Thyroid disorder'
  | 'Diabetes'
  | 'Autoimmune disease'
  | 'Anemia'
  | 'None';

export type MenstrualCycle = 'Regular' | 'Irregular' | 'Menopausal' | 'Not applicable';

export type PregnancyRelated = 'Currently pregnant' | 'Postpartum <1 year' | 'Not applicable';

export type PastSixMonthsTrigger =
  | 'Crash dieting or major weight loss'
  | 'High stress or emotional trauma'
  | 'Fever with illness (COVID, Dengue, Typhoid)'
  | 'Recent surgery'
  | 'Change in location/water/air quality';

export type SmokingSeverity = 'Mild <5/day' | 'Moderate 5-10/day' | 'Severe >10/day';

export type HairWashFrequency = 'Daily' | 'Alternate Days' | 'Weekly';

export type ProductDuration = '<3mo' | '3-6mo' | '>6mo';

export type ProcedureSessions = '1-3' | '4-6' | '>6';

export type SampleType = 'Saliva' | 'Blood' | 'Either';

export interface HabitsData {
  smoking: boolean | null;
  smoking_severity?: SmokingSeverity;
  alcohol: boolean | null;
  hard_water: boolean | null;
  hair_wash_frequency: HairWashFrequency | null;
  heating_tools_styling_chemicals: boolean | null;
  salon_treatments: boolean | null;
  salon_treatment_detail?: string;
  [key: string]: unknown;
}

export interface ProductRow {
  used: boolean;
  duration?: ProductDuration;
  helped?: boolean;
  side_effects?: boolean;
}

export interface ProcedureRow {
  done: boolean;
  sessions?: ProcedureSessions;
  helped?: boolean;
}

export interface IntakeFormData {
  patient_name: string;
  sex: Sex | null;
  /** UI-only — used to infer duration. Not in schema output. */
  current_age: number | null;

  age_hair_loss_began: number | null;
  duration: Duration | null;
  family_history: FamilyHistory[];
  pattern: HairLossPattern[];

  diagnosed_conditions: DiagnosedCondition[];
  menstrual_cycle: MenstrualCycle | null;
  pregnancy_related: PregnancyRelated | null;
  adult_acne_oily_skin: boolean | null;
  excess_body_facial_hair: boolean | null;

  past_6_months: PastSixMonthsTrigger[];
  past_6_months_none: boolean;
  habits: HabitsData;

  tried_products: boolean | null;
  tried_procedures: boolean | null;
  products: {
    'OTC/Medicated Shampoos': ProductRow;
    'Hair Oils/Serums': ProductRow;
    'Topical Minoxidil': ProductRow;
    'Oral Minoxidil': ProductRow;
    'Supplements': ProductRow;
  };
  procedures: {
    'PRP/GFC/iPRF': ProcedureRow;
    'Stem Cells/Exosomes': ProcedureRow;
    'Hair Transplant': ProcedureRow;
    'Other': ProcedureRow;
  };
  past_treatment_side_effects: boolean | null;
  past_treatment_side_effects_describe?: string;

  sample_type: SampleType | null;
  consent: boolean | null;
}

export type FormStep =
  | 'welcome'
  | 'onset'
  | 'history'
  | 'health'
  | 'lifestyle'
  | 'treatments'
  | 'sample'
  | 'review';

export const PATIENT_STEPS: FormStep[] = [
  'onset',
  'history',
  'health',
  'lifestyle',
  'treatments',
  'sample',
];
