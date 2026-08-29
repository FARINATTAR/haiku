# GenoRoot hair intake

Patient intake for the Haiku Studio take-home. Six screens fill the 16-question schema. The doctor-facing JSON is on the last screen.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173. On a phone, or Chrome DevTools at 390px width. Pinch-zoom is left on — a 55-year-old should be able to enlarge type.

## Choices

**What the patient sees.** Not 16 next-buttons and not a chat box. Screens are: who this is for → when it started → family + scalp map → health → last 6 months + habits → what they have tried → sample + consent → review JSON.

**Per question.** Age is a stepper. Duration is inferred from current age minus onset age, then confirmed. Pattern is a top-view scalp, not a jargon list. Products and procedures stay collapsed behind “have you tried anything?” Habits are one yes/no row each, not accordions.

**Inference.** PCOS on a female path pre-fills irregular cycle, adult acne, and extra facial hair (they can change it). Sudden shedding offers illness / stress / crash diet as a one-tap confirm. Male path skips cycle and pregnancy. Widening-part is de-emphasized for men.

**Voice.** Browser Web Speech API (`en-IN`) only where typing is worse: ages, salon detail, side-effect text. Mic is hidden if the browser has no speech recognition (Safari often). No paid STT this week — a clinic waiting room is noisy; taps are the path.

**Stack.** React 19, TypeScript, Vite, Framer Motion for screen transitions, CSS tokens. Nothing else. Drafts persist in `localStorage` (`genoroot_intake_draft_v3`). No login, no backend, no API keys.

**Schema.** Output keys match `intake-schema.json`. Extra UI state (`current_age`, `tried_products`, `past_6_months_none`) is not in the JSON. Family history does not include a made-up “other relative” option. Q6/Q7 are omitted for non-female patients.

## How I checked the fill

1. Female + PCOS: JSON has irregular cycle, acne true, extra hair true, and section B includes menstrual/pregnancy keys.
2. Male: section B has no menstrual_cycle / pregnancy_related; Q6/Q7 never shown.
3. “Not yet” on products/procedures: every product `used: false`, every procedure `done: false`.
4. “None of these” on last 6 months: `past_6_months: []`.
5. Smoking yes without severity, or salon yes without text: Next stays disabled.
6. Review JSON compared against the schema options for every multi/single field.

## With one more week

- WhatsApp magic link so this is done at home, not in the waiting room.
- Whisper fallback for noisy rooms / browsers without Web Speech.
- Optional scalp photo that *sets* pattern (Norwood / Ludwig), not a dead upload.
- PWA cache for clinic tablets with bad Wi-Fi.
