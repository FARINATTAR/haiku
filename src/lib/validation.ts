import type { IntakeFormData, FormStep } from '../types';

export function isStepValid(step: FormStep, data: IntakeFormData): boolean {
  switch (step) {
    case 'welcome':
      return data.patient_name.trim().length > 0 && data.sex !== null;

    case 'onset': {
      const onset = data.age_hair_loss_began;
      if (onset === null || data.duration === null) return false;
      if (onset < 1 || onset > 99) return false;
      if (data.current_age !== null && data.current_age < onset) return false;
      return true;
    }

    case 'history':
      return data.family_history.length > 0 && data.pattern.length > 0;

    case 'health': {
      if (data.diagnosed_conditions.length === 0) return false;
      if (data.adult_acne_oily_skin === null || data.excess_body_facial_hair === null) return false;
      if (data.sex === 'female') {
        return data.menstrual_cycle !== null && data.pregnancy_related !== null;
      }
      return true;
    }

    case 'lifestyle': {
      const h = data.habits;
      if (!data.past_6_months_none && data.past_6_months.length === 0) return false;
      if (h.smoking === null || h.alcohol === null || h.hard_water === null) return false;
      if (h.hair_wash_frequency === null) return false;
      if (h.heating_tools_styling_chemicals === null || h.salon_treatments === null) return false;
      if (h.smoking === true && !h.smoking_severity) return false;
      if (h.salon_treatments === true && !String(h.salon_treatment_detail ?? '').trim()) return false;
      return true;
    }

    case 'treatments': {
      if (data.tried_products === null || data.tried_procedures === null) return false;
      if (data.past_treatment_side_effects === null) return false;
      if (data.tried_products === true) {
        const used = Object.values(data.products).filter((p) => p.used);
        if (used.length === 0) return false;
        if (used.some((p) => !p.duration || p.helped === undefined || p.side_effects === undefined)) return false;
      }
      if (data.tried_procedures === true) {
        const done = Object.values(data.procedures).filter((p) => p.done);
        if (done.length === 0) return false;
        if (done.some((p) => !p.sessions || p.helped === undefined)) return false;
      }
      if (data.past_treatment_side_effects === true && !data.past_treatment_side_effects_describe?.trim()) {
        return false;
      }
      return true;
    }

    case 'sample':
      return data.sample_type !== null && data.consent === true;

    case 'review':
      return true;

    default:
      return true;
  }
}
