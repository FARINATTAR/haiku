export type DurationValue = 'Less than 6 months' | '6-12 months' | 'Over a year';

export function parseDurationVoice(spokenText: string): DurationValue | null {
  const text = spokenText.toLowerCase().replace(/[-_]/g, ' ').trim();

  const monthMatch = text.match(/(\d+)\s*(month|months|mahina|mahine|mth)/);
  if (monthMatch) {
    const num = parseInt(monthMatch[1], 10);
    if (num < 6) return 'Less than 6 months';
    if (num <= 12) return '6-12 months';
    return 'Over a year';
  }

  const yearMatch = text.match(/(\d+)\s*(year|years|saal)/);
  if (yearMatch) {
    const num = parseInt(yearMatch[1], 10);
    if (num < 1) return 'Less than 6 months';
    if (num === 1) {
      if (text.includes('less') || text.includes('under') || text.includes('kam')) {
        return 'Less than 6 months';
      }
      return 'Over a year';
    }
    return 'Over a year';
  }

  if (
    text.includes('less than 6') ||
    text.includes('under 6') ||
    text.includes('6 months se kam') ||
    text.includes('recently') ||
    text.includes('shuru shuru')
  ) {
    return 'Less than 6 months';
  }

  if (
    text.includes('6 to 12') ||
    text.includes('6-12') ||
    text.includes('6 se 12') ||
    text.includes('six to twelve')
  ) {
    return '6-12 months';
  }

  if (
    text.includes('over a year') ||
    text.includes('more than a year') ||
    text.includes('ek saal se zyada') ||
    text.includes('ek saal se jyada') ||
    text.includes('saalon')
  ) {
    return 'Over a year';
  }

  return null;
}

export function parseYesNo(spokenText: string): boolean | null {
  const t = spokenText.toLowerCase().trim();
  if (/^(yes|yeah|yep|haan|ha|bilkul|sahi|agree|consent)(\b|!|\.)/i.test(t) || t === 'ha' || t === 'haan') {
    return true;
  }
  if (/^(no|nope|nahi|nahin)(\b|!|\.)/i.test(t) || t === 'nahi' || t === 'no') {
    return false;
  }
  return null;
}

export function matchVoiceToOption(
  spokenText: string,
  options: { value: string; label: string }[]
): string | null {
  const text = spokenText.toLowerCase().trim();

  if (text.includes('papa') || text.includes('father') || text.includes('dad') || text.includes('pitaji')) {
    const opt = options.find((o) => o.value.toLowerCase().includes('father'));
    if (opt) return opt.value;
  }
  if (text.includes('mummy') || text.includes('mother') || text.includes('mom') || text.includes('mataji')) {
    const opt = options.find((o) => o.value.toLowerCase().includes('mother'));
    if (opt) return opt.value;
  }
  if (text.includes('bhai') || text.includes('behen') || text.includes('sibling') || text.includes('brother') || text.includes('sister')) {
    const opt = options.find((o) => o.value.toLowerCase().includes('sibling'));
    if (opt) return opt.value;
  }

  if (text.includes('kisi ko nahi') || text === 'none' || text.includes('no one') || text.includes('nobody') || text.includes('no known')) {
    const noneOpt = options.find((o) => o.value.toLowerCase().includes('none') || o.value.toLowerCase().includes('no known'));
    if (noneOpt) return noneOpt.value;
  }

  for (const opt of options) {
    const label = opt.label.toLowerCase();
    const val = opt.value.toLowerCase();
    if (text.includes(label) || text.includes(val)) {
      return opt.value;
    }
  }

  return null;
}

export function matchVoiceToMultiple(
  spokenText: string,
  options: { value: string; label: string; aliases?: string[] }[]
): string[] {
  const text = spokenText.toLowerCase().trim();
  const matched: string[] = [];

  if (text.includes('kisi ko nahi') || text.includes('kuch nahi') || text === 'none' || text === 'no one' || text === 'nobody') {
    const noneOpt = options.find((o) => o.value.toLowerCase().includes('none') || o.value.toLowerCase().includes('no known'));
    if (noneOpt) return [noneOpt.value];
  }

  const familyKeywords: Record<string, string> = {
    papa: 'father',
    pitaji: 'father',
    father: 'father',
    dad: 'father',
    mummy: 'mother',
    mother: 'mother',
    mom: 'mother',
    mataji: 'mother',
    bhai: 'sibling',
    behen: 'sibling',
    sibling: 'sibling',
    brother: 'sibling',
    sister: 'sibling',
  };

  for (const [keyword, matchKey] of Object.entries(familyKeywords)) {
    if (text.includes(keyword)) {
      const opt = options.find((o) => o.value.toLowerCase().includes(matchKey));
      if (opt && !matched.includes(opt.value)) {
        matched.push(opt.value);
      }
    }
  }

  for (const opt of options) {
    if (matched.includes(opt.value)) continue;
    const label = opt.label.toLowerCase();
    const val = opt.value.toLowerCase();

    if (text.includes(label) || text.includes(val)) {
      matched.push(opt.value);
      continue;
    }

    if (opt.aliases) {
      for (const alias of opt.aliases) {
        if (text.includes(alias.toLowerCase())) {
          matched.push(opt.value);
          break;
        }
      }
    }
  }

  return matched;
}

export function extractNumberFromVoice(spokenText: string): number | null {
  const text = spokenText.toLowerCase().trim();

  const digitMatch = text.match(/\d+/);
  if (digitMatch) {
    const parsed = parseInt(digitMatch[0], 10);
    if (!isNaN(parsed)) return parsed;
  }

  const words: Record<string, number> = {
    one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
    eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17,
    eighteen: 18, nineteen: 19, twenty: 20, 'twenty one': 21, 'twenty two': 22, 'twenty three': 23,
    'twenty four': 24, 'twenty five': 25, 'twenty six': 26, 'twenty seven': 27, 'twenty eight': 28,
    'twenty nine': 29, thirty: 30, 'thirty one': 31, 'thirty two': 32, 'thirty five': 35,
    forty: 40, 'forty five': 45, fifty: 50,
    atharah: 18, unnees: 19, bees: 20, ikkees: 21, baais: 22, teis: 23, chaubis: 24,
    pachees: 25, chhabees: 26, sattais: 27, athhais: 28, untees: 29, tees: 30,
    iktees: 31, battis: 32, paintis: 35, chaalis: 40, pachaas: 50,
  };

  const sorted = Object.entries(words).sort((a, b) => b[0].length - a[0].length);
  for (const [word, num] of sorted) {
    if (text.includes(word)) return num;
  }

  return null;
}
