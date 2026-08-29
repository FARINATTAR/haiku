import { haptic } from '../../lib/haptic';
import type { HairLossPattern } from '../../types';

interface ScalpMapProps {
  selected: HairLossPattern[];
  onToggle: (value: HairLossPattern) => void;
  emphasizePart?: boolean;
}

const ZONES: { value: HairLossPattern; label: string; hint: string }[] = [
  { value: 'Receding hairline', label: 'Hairline', hint: 'Temples / forehead' },
  { value: 'Thinning at crown', label: 'Crown', hint: 'Top-back of the head' },
  { value: 'Widening part line', label: 'Part', hint: 'Centre line looking wider' },
  { value: 'Diffuse thinning', label: 'All over', hint: 'Thinner everywhere' },
];

const CHIPS: { value: HairLossPattern; label: string }[] = [
  { value: 'Patchy loss', label: 'Coin-shaped bald patches' },
  { value: 'Sudden excessive shedding', label: 'Handfuls coming out in the shower' },
];

export function ScalpMap({ selected, onToggle, emphasizePart = true }: ScalpMapProps) {
  const isOn = (v: HairLossPattern) => selected.includes(v);

  return (
    <div className="scalp">
      <p className="scalp__hint">Tap where you notice change. You can pick more than one.</p>
      <svg className="scalp__svg" viewBox="0 0 200 240" role="img" aria-label="Scalp map, top view">
        <ellipse cx="100" cy="118" rx="72" ry="92" className={`scalp__head ${isOn('Diffuse thinning') ? 'scalp__head--all' : ''}`} />
        <text x="100" y="28" textAnchor="middle" className="scalp__face-label">
          forehead
        </text>

        <path
          d="M48 70 Q100 42 152 70 Q148 95 100 88 Q52 95 48 70 Z"
          className={`scalp__zone ${isOn('Receding hairline') ? 'scalp__zone--on' : ''}`}
          onClick={() => {
            haptic();
            onToggle('Receding hairline');
          }}
        />
        <text x="100" y="72" textAnchor="middle" className="scalp__zone-label">
          Hairline
        </text>

        <rect
          x="92"
          y="88"
          width="16"
          height="70"
          rx="8"
          className={`scalp__zone ${isOn('Widening part line') ? 'scalp__zone--on' : ''} ${emphasizePart ? '' : 'scalp__zone--muted'}`}
          onClick={() => {
            haptic();
            onToggle('Widening part line');
          }}
        />

        <ellipse
          cx="100"
          cy="168"
          rx="28"
          ry="24"
          className={`scalp__zone ${isOn('Thinning at crown') ? 'scalp__zone--on' : ''}`}
          onClick={() => {
            haptic();
            onToggle('Thinning at crown');
          }}
        />
        <text x="100" y="172" textAnchor="middle" className="scalp__zone-label">
          Crown
        </text>
      </svg>

      <div className="scalp__legend">
        {ZONES.map((z) => (
          <button
            key={z.value}
            type="button"
            className={`scalp__chip ${isOn(z.value) ? 'scalp__chip--on' : ''} ${z.value === 'Widening part line' && !emphasizePart ? 'scalp__chip--muted' : ''}`}
            onClick={() => {
              haptic();
              onToggle(z.value);
            }}
          >
            <span className="scalp__chip-label">{z.label}</span>
            <span className="scalp__chip-hint">{z.hint}</span>
          </button>
        ))}
      </div>

      <div className="scalp__extra">
        {CHIPS.map((c) => (
          <button
            key={c.value}
            type="button"
            className={`chip ${isOn(c.value) ? 'chip--selected' : ''}`}
            onClick={() => {
              haptic();
              onToggle(c.value);
            }}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
