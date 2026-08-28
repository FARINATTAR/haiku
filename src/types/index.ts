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

// Habits (Q11)
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

// Product row (Q12)
export interface ProductRow {
  used: boolean;
  duration?: ProductDuration;
  helped?: boolean;
  side_effects?: boolean;
}

// Procedure row (Q13)
export interface ProcedureRow {
  done: boolean;
  sessions?: ProcedureSessions;
  helped?: boolean;
}

// Complete form state
export interface IntakeFormData {
  // Welcome
  patient_name: string;
  sex: Sex | null;

  // Section A: Personal & Family Hair Loss History
  age_hair_loss_began: number | null;           // Q1
  duration: Duration | null;                     // Q2
  family_history: FamilyHistory[];               // Q3
  pattern: HairLossPattern[];                    // Q4

  // Section B: Hormonal & Health Influences
  diagnosed_conditions: DiagnosedCondition[];    // Q5
  menstrual_cycle: MenstrualCycle | null;        // Q6 (female only)
  pregnancy_related: PregnancyRelated | null;    // Q7 (female only)
  adult_acne_oily_skin: boolean | null;          // Q8
  excess_body_facial_hair: boolean | null;       // Q9

  // Section C: Lifestyle & Environmental Triggers
  past_6_months: PastSixMonthsTrigger[];         // Q10
  habits: HabitsData;                            // Q11

  // Section D: Current Hair Care & Treatments
  products: {                                    // Q12
    'OTC/Medicated Shampoos': ProductRow;
    'Hair Oils/Serums': ProductRow;
    'Topical Minoxidil': ProductRow;
    'Oral Minoxidil': ProductRow;
    'Supplements': ProductRow;
  };
  procedures: {                                  // Q13
    'PRP/GFC/iPRF': ProcedureRow;
    'Stem Cells/Exosomes': ProcedureRow;
    'Hair Transplant': ProcedureRow;
    'Other': ProcedureRow;
  };
  past_treatment_side_effects: boolean | null;   // Q14
  past_treatment_side_effects_describe?: string;

  // Section E: Sample Collection & Consent
  sample_type: SampleType | null;                // Q15
  consent: boolean | null;                       // Q16
}

// Section metadata for navigation
export interface Section {
  id: string;
  title: string;
  icon: string;
  questionRange: [number, number]; // [start, end] inclusive
}

// Step in the form flow: 0=welcome, 1-16=questions, 17=review
export type FormStep = number;
