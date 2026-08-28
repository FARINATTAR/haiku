// Smart voice matcher that maps spoken text to form choices

export function matchVoiceToOption(spokenText: string, options: { value: string; label: string }[]): string | null {
  const text = spokenText.toLowerCase().trim();

  // Exact or partial label match
  for (const opt of options) {
    const label = opt.label.toLowerCase();
    const val = opt.value.toLowerCase();
    if (text.includes(label) || text.includes(val) || label.includes(text)) {
      return opt.value;
    }
  }

  // Common synonyms / hindi words
  if (text.includes('ha') || text.includes('haan') || text.includes('yes') || text.includes('sahi')) {
    const yesOpt = options.find((o) => o.value.toLowerCase() === 'yes' || o.label.toLowerCase().includes('yes'));
    if (yesOpt) return yesOpt.value;
  }
  if (text.includes('nahi') || text.includes('na') || text.includes('no')) {
    const noOpt = options.find((o) => o.value.toLowerCase() === 'no' || o.label.toLowerCase().includes('none') || o.label.toLowerCase().includes('no'));
    if (noOpt) return noOpt.value;
  }
  if (text.includes('papa') || text.includes('father') || text.includes('dad')) {
    const fatherOpt = options.find((o) => o.value.toLowerCase().includes('father'));
    if (fatherOpt) return fatherOpt.value;
  }
  if (text.includes('mummy') || text.includes('mother') || text.includes('mom')) {
    const motherOpt = options.find((o) => o.value.toLowerCase().includes('mother'));
    if (motherOpt) return motherOpt.value;
  }
  if (text.includes('bhai') || text.includes('behen') || text.includes('sibling') || text.includes('brother') || text.includes('sister')) {
    const sibOpt = options.find((o) => o.value.toLowerCase().includes('sibling'));
    if (sibOpt) return sibOpt.value;
  }

  return null;
}

export function extractNumberFromVoice(spokenText: string): number | null {
  const text = spokenText.toLowerCase();

  // Try direct digits
  const digitMatch = text.match(/\d+/);
  if (digitMatch) {
    return parseInt(digitMatch[0], 10);
  }

  // Word to number mapping
  const words: Record<string, number> = {
    one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
    eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17,
    eighteen: 18, nineteen: 19, twenty: 20, 'twenty one': 21, 'twenty two': 22, 'twenty three': 23,
    'twenty four': 24, 'twenty five': 25, 'twenty six': 26, 'twenty seven': 27, 'twenty eight': 28,
    'twenty nine': 29, thirty: 30, 'thirty five': 35, forty: 40, 'forty five': 45, fifty: 50,
    // Hindi numbers
    bees: 20, ikkees: 21, baais: 22, teis: 23, chaubis: 24, pachees: 25, chhabees: 26,
    sattais: 27, athhais: 28, untees: 29, tees: 30, paintis: 35, chaalis: 40, pachaas: 50,
  };

  for (const [word, num] of Object.entries(words)) {
    if (text.includes(word)) return num;
  }

  return null;
}
