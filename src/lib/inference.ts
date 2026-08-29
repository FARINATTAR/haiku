import type { Duration, HairLossPattern, PastSixMonthsTrigger } from '../types';

export function inferDuration(currentAge: number, onsetAge: number): Duration | null {
  const years = currentAge - onsetAge;
  if (!Number.isFinite(years) || years < 0) return null;
  if (years >= 2) return 'Over a year';
  if (years === 1) return '6-12 months';
  return 'Less than 6 months';
}

export function durationInferenceLabel(currentAge: number, onsetAge: number, duration: Duration): string {
  const years = currentAge - onsetAge;
  if (years <= 0) {
    return `Started this year — ${duration.toLowerCase()} sounds right.`;
  }
  if (years === 1) {
    return `Started about a year ago — we marked ${duration.toLowerCase()}. Change it if that is off.`;
  }
  return `Started at ${onsetAge}, you are ${currentAge} — that is over a year. Change it if that is off.`;
}

export const SHEDDING_TRIGGERS: PastSixMonthsTrigger[] = [
  'Crash dieting or major weight loss',
  'High stress or emotional trauma',
  'Fever with illness (COVID, Dengue, Typhoid)',
];

export function hasSuddenShedding(pattern: HairLossPattern[]): boolean {
  return pattern.includes('Sudden excessive shedding');
}
