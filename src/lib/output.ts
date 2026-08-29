import type { IntakeFormData } from '../types';

/** Filled intake matching the take-home schema keys. Extra UI-only fields are omitted. */
export function buildOutput(data: IntakeFormData) {
  const female = data.sex === 'female';

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
        ...(female
          ? {
              menstrual_cycle: data.menstrual_cycle,
              pregnancy_related: data.pregnancy_related,
            }
          : {}),
        adult_acne_oily_skin: data.adult_acne_oily_skin,
        excess_body_facial_hair: data.excess_body_facial_hair,
      },
      C: {
        past_6_months: data.past_6_months,
        habits: {
          smoking: data.habits.smoking,
          ...(data.habits.smoking === true && data.habits.smoking_severity
            ? { smoking_severity: data.habits.smoking_severity }
            : {}),
          alcohol: data.habits.alcohol,
          hard_water: data.habits.hard_water,
          hair_wash_frequency: data.habits.hair_wash_frequency,
          heating_tools_styling_chemicals: data.habits.heating_tools_styling_chemicals,
          salon_treatments: data.habits.salon_treatments,
          ...(data.habits.salon_treatments === true && data.habits.salon_treatment_detail
            ? { salon_treatment_detail: data.habits.salon_treatment_detail }
            : {}),
        },
      },
      D: {
        products: data.products,
        procedures: data.procedures,
        past_treatment_side_effects: data.past_treatment_side_effects,
        ...(data.past_treatment_side_effects === true && data.past_treatment_side_effects_describe
          ? { describe: data.past_treatment_side_effects_describe }
          : {}),
      },
      E: {
        sample_type: data.sample_type,
        consent: data.consent,
      },
    },
  };
}
