// Smart voice matcher that maps spoken English and Hindi keywords to form choices

export function parseDurationVoice(spokenText: string): 'Less than 6 months' | '6-12 months' | 'Over a year' | null {
  const text = spokenText.toLowerCase().replace(/[-_]/g, ' ').trim();

  // Over a year patterns
  if (
    text.includes('over') ||
    text.includes('upar') ||
    text.includes('jyada') ||
    text.includes('zyada') ||
    text.includes('more than') ||
    text.includes('1 year') ||
    text.includes('1 saal') ||
    text.includes('ek saal') ||
    text.includes('2 year') ||
    text.includes('2 saal') ||
    text.includes('do saal') ||
    text.includes('3 year') ||
    text.includes('years') ||
    text.includes('saalon')
  ) {
    // If explicitly says "less than a year" or "6 months"
    if (text.includes('less') || text.includes('kam')) {
      return 'Less than 6 months';
    }
    return 'Over a year';
  }

  // Check for month numbers (e.g. "8 months", "7 mahine")
  const digitMatch = text.match(/(\d+)\s*(month|mahina|mahine|moths|mth)/);
  if (digitMatch) {
    const num = parseInt(digitMatch[1], 10);
    if (num < 6) return 'Less than 6 months';
    if (num <= 12) return '6-12 months';
    return 'Over a year';
  }

  // Direct word checks for months
  if (text.includes('8') || text.includes('7') || text.includes('9') || text.includes('10') || text.includes('11') || text.includes('6 12') || text.includes('6 to 12') || text.includes('6 se 12')) {
    return '6-12 months';
  }

  if (text.includes('under') || text.includes('less') || text.includes('kam') || text.includes('recently') || text.includes('shuru') || text.includes('1 month') || text.includes('2 month') || text.includes('3 month') || text.includes('4 month') || text.includes('5 month')) {
    return 'Less than 6 months';
  }

  return null;
}

export function matchVoiceToOption(spokenText: string, options: { value: string; label: string }[]): string | null {
  const text = spokenText.toLowerCase().trim();

  // Family history specific words
  if (text.includes('papa') || text.includes('father') || text.includes('dad') || text.includes('pitaji')) {
    const opt = options.find((o) => o.value.toLowerCase().includes('father'));
    if (opt) return opt.value;
  }
  if (text.includes('mummy') || text.includes('mother') || text.includes('mom') || text.includes('mataji') || text.includes('maa')) {
    const opt = options.find((o) => o.value.toLowerCase().includes('mother'));
    if (opt) return opt.value;
  }
  if (text.includes('bhai') || text.includes('behen') || text.includes('sibling') || text.includes('brother') || text.includes('sister')) {
    const opt = options.find((o) => o.value.toLowerCase().includes('sibling'));
    if (opt) return opt.value;
  }

  // Exact "none" / "kisi ko nahi" / "no one"
  if (text.includes('kisi ko nahi') || text.includes('none') || text.includes('no one') || text.includes('nobody') || text.includes('no known')) {
    const noneOpt = options.find((o) => o.value.toLowerCase().includes('none') || o.value.toLowerCase().includes('no known'));
    if (noneOpt) return noneOpt.value;
  }

  // Yes / No matching
  if (text.includes('haan') || text.includes('yes') || text.includes('sahi') || text.includes('agree') || text.includes('bilkul')) {
    const yesOpt = options.find((o) => o.value.toLowerCase() === 'yes' || o.label.toLowerCase().includes('yes'));
    if (yesOpt) return yesOpt.value;
  }
  if (text === 'no' || text === 'nahi' || text === 'na' || text.startsWith('nahi') || text.startsWith('no')) {
    const noOpt = options.find((o) => o.value.toLowerCase() === 'no' || o.label.toLowerCase() === 'no');
    if (noOpt) return noOpt.value;
  }

  // Exact or substring option matching
  for (const opt of options) {
    const label = opt.label.toLowerCase();
    const val = opt.value.toLowerCase();
    if (text.includes(label) || label.includes(text) || text.includes(val)) {
      return opt.value;
    }
  }

  return null;
}

/**
 * Like matchVoiceToOption but returns ALL matching options from a single spoken input.
 * e.g. "receding hairline and widening part line" → ['Receding hairline', 'Widening part line']
 */
export function matchVoiceToMultiple(spokenText: string, options: { value: string; label: string; aliases?: string[] }[]): string[] {
  const text = spokenText.toLowerCase().trim();
  const matched: string[] = [];

  // "None" / exclusive options — if detected, return only that
  if (text.includes('kisi ko nahi') || text.includes('kuch nahi') || text === 'none' || text === 'no one' || text === 'nobody') {
    const noneOpt = options.find((o) => o.value.toLowerCase().includes('none') || o.value.toLowerCase().includes('no known'));
    if (noneOpt) return [noneOpt.value];
  }

  // Family-specific keyword matching
  const familyKeywords: Record<string, string> = {
    papa: 'father', pitaji: 'father', father: 'father', dad: 'father',
    mummy: 'mother', mother: 'mother', mom: 'mother', mataji: 'mother', maa: 'mother',
    bhai: 'sibling', behen: 'sibling', sibling: 'sibling', brother: 'sibling', sister: 'sibling',
    other: 'other', relative: 'other', uncle: 'other', aunt: 'other', grandparent: 'other', dada: 'other', dadi: 'other', nana: 'other', nani: 'other',
  };

  for (const [keyword, matchKey] of Object.entries(familyKeywords)) {
    if (text.includes(keyword)) {
      const opt = options.find((o) => o.value.toLowerCase().includes(matchKey));
      if (opt && !matched.includes(opt.value)) {
        matched.push(opt.value);
      }
    }
  }

  // General substring matching — check each option's label and value against the text
  for (const opt of options) {
    if (matched.includes(opt.value)) continue;
    const label = opt.label.toLowerCase();
    const val = opt.value.toLowerCase();

    // Check if the spoken text contains the label or value
    if (text.includes(label) || text.includes(val)) {
      matched.push(opt.value);
      continue;
    }

    // Check aliases if provided
    if (opt.aliases) {
      for (const alias of opt.aliases) {
        if (text.includes(alias.toLowerCase())) {
          matched.push(opt.value);
          break;
        }
      }
    }

    // Check individual significant words from label (3+ chars) against the text
    const labelWords = label.split(/\s+/).filter(w => w.length >= 3);
    // If label has 2+ significant words, check if at least 2 appear in the spoken text
    if (labelWords.length >= 2) {
      const wordMatches = labelWords.filter(w => text.includes(w));
      if (wordMatches.length >= 2 && !matched.includes(opt.value)) {
        matched.push(opt.value);
      }
    }
  }

  return matched;
}


export function extractNumberFromVoice(spokenText: string): number | null {
  const text = spokenText.toLowerCase().trim();

  // Try direct digits
  const digitMatch = text.match(/\d+/);
  if (digitMatch) {
    const parsed = parseInt(digitMatch[0], 10);
    if (!isNaN(parsed)) return parsed;
  }

  // Word to number mapping
  const words: Record<string, number> = {
    one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
    eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17,
    eighteen: 18, nineteen: 19, twenty: 20, 'twenty one': 21, 'twenty two': 22, 'twenty three': 23,
    'twenty four': 24, 'twenty five': 25, 'twenty six': 26, 'twenty seven': 27, 'twenty eight': 28,
    'twenty nine': 29, thirty: 30, 'thirty one': 31, 'thirty two': 32, 'thirty five': 35,
    forty: 40, 'forty five': 45, fifty: 50,
    // Hindi numbers phonetics
    atharah: 18, unnees: 19, bees: 20, ikkees: 21, baais: 22, teis: 23, chaubis: 24,
    pachees: 25, chhabees: 26, sattais: 27, athhais: 28, untees: 29, tees: 30,
    iktees: 31, battis: 32, paintis: 35, chaalis: 40, pachaas: 50,
  };

  for (const [word, num] of Object.entries(words)) {
    if (text.includes(word)) return num;
  }

  return null;
}
