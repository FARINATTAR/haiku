# GenoRoot — Smart Hair & Scalp Intake Form
> Built for Haiku Studio take-home assignment by Farin Attar.

A patient-first, voice-assisted clinical intake web app for hair & scalp clinics. It turns a tedious 16-question paper form into a fast, guided 2-minute flow on both phone and laptop.

---

## 🚀 Quick Start (Run Locally)

```bash
# 1. Clone repo
git clone https://github.com/FARINATTAR/haiku.git
cd haiku

# 2. Install dependencies
npm install

# 3. Start local dev server
npm run dev
```
Open `http://localhost:5173` in your browser.

To test mobile responsiveness on your computer, use Chrome DevTools device mode (`Cmd+Shift+M` or `Ctrl+Shift+M` at 375px/390px width).

---

## 💡 Key Design & Engineering Decisions

### 1. Per-Question Interaction Design (No Chatbots)
A chat interface where patients have to type out medical history or wait on slow LLM streaming adds friction, especially for older patients. Instead, each question has an interaction tailored to the data it collects:
- **Age onset:** Stepper buttons with one-tap quick-select pills (`18, 21, 25, 28, 32...`).
- **Duration / Conditions / Pattern:** High-contrast tap cards with **Doctor Note tooltips** explaining jargon (e.g., Alopecia Areata, Ferritin, PCOS).
- **Lifestyle & Treatments:** Accordion toggle cards for products/procedures with dependent follow-up triggers (duration, helped, side-effects).
- **Hormonal routing:** Questions 6 & 7 (Menstrual cycle / Pregnancy) automatically skip for male patients based on biological sex selected on screen 1.

### 2. Zero-Latency Voice Engine + Hinglish Pattern Matcher
Instead of routing speech through heavy server-side LLM APIs (which introduces 1-2 second latency and breaks the flow), I used the browser's native **Web Speech API** paired with an offline, deterministic phonetic and alias parser:
- **Multi-select in one breath:** Saying *"receding hairline and widening part line"* parses and checks both options simultaneously.
- **Bilingual / Hinglish Support:** Understands colloquial terms like *"papa"*, *"mummy"*, *"kisi ko nahi"*, *"khoon ki kami"*, and auto-selects the right schema value.
- **Instant visual feedback:** Mic button pulses red while recording, then matches directly to UI state with haptic feedback on mobile.

### 3. Polish & Feel
- **Haptic Feedback:** Vibrates subtly on tap on supported mobile devices.
- **Keyboard Navigation:** `Enter` key auto-validates and advances to the next step.
- **Sticky gradient bottom nav:** Safe-area inset support for iPhone notch/home bar, ensuring buttons never get clipped.
- **Dynamic time estimate badge:** Updates in real-time (`~2 min left` -> `~1 min left`) so patients know it won't take long.

---

## 🛠️ Tech Stack & Trade-offs (Built vs. Bought)

| Layer | Choice | Why I chose it / Trade-off |
| :--- | :--- | :--- |
| **Framework** | React 19 + TypeScript + Vite | Instant sub-second HMR, rock-solid type safety, and clean component isolation. |
| **Animations** | Framer Motion | Smooth slide transitions between questions and expanding accordion bodies without layout jank. |
| **Styling** | Vanilla CSS with Design Tokens | Maximum control over micro-animations, glassmorphism, responsive breakpoints, and dark/light accents without heavy CSS framework runtime. |
| **Voice Engine** | Native Web Speech API + Regex/Alias Matcher | **Bought (Off-the-shelf):** Zero latency, zero API costs, runs 100% locally on the device without network dependencies. |
| **Output** | Exact `intake-schema.json` compliant JSON | Live collapsible structured viewer on the review screen for clinical integration verification. |

---

## 🧪 How I Tested It

1. **Schema Compliance:** Validated the JSON structure generated in `ReviewScreen.tsx` against the provided `intake-schema.json` across multiple edge cases (e.g., male patient skipping Q6/Q7, multi-select combinations, empty optional side-effect text).
2. **Device & Screen Testing:** Tested across 320px (small phones), 390px (iPhone 14/15), 768px (iPad/tablets), and 1440px (desktop monitor) to ensure the card layout stays centered and thumb-accessible.
3. **Voice Accents & Edge Cases:** Tested speech recognition with both standard English and Hinglish phrases, spoken quickly, and spoken with multiple options in one sentence.

---

## 🔮 What I Would Build With One More Week

1. **Whisper API Fallback:** Add a server-side OpenAI Whisper fallback for older browsers that lack native `webkitSpeechRecognition` or for extremely noisy clinic environments.
2. **AI Scalp Photo Pre-Screening:** Integrate a lightweight computer vision classifier on the optional scalp photo upload to pre-estimate the Norwood / Ludwig hair loss grade before the doctor sees the patient.
3. **WhatsApp / SMS Intake Link:** Generate a tokenized one-time magic link sent via WhatsApp 2 hours before the patient's appointment, syncing directly to the clinic's EMR.
4. **Offline PWA Support:** Add service worker caching so clinic tablets in basement rooms with poor Wi-Fi can run the intake completely offline and sync when reconnected.
