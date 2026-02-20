import { useState } from 'react';
import { SLICES, SLICE_ANGLE, SLICE_TO_ZONE, ZONES, ZONE_ANGLES } from '@/data/vastuData';
import devtasData from '@/data/VastuDevtas.json';

const CX = 350, CY = 350;
const SLICE_OUTER = 240, SLICE_INNER = 110, LABEL_R = 180;
const ZONE_OUTER = 310, ZONE_INNER = 245;

const DEVTA_RING_INNER = 118;
const DEVTA_RING_OUTER = 158;

const DEVTA_ZONE_COLOR: Record<string, string> = {
  North: '#22c55e', NNW: '#0ea5e9', NE: '#10b981', ENE: '#14b8a6',
  East: '#3b82f6', ESE: '#f97316', SE: '#ef4444', South: '#dc2626',
  SSW: '#f97316', SW: '#b91c1c', WSW: '#2563eb', West: '#eab308',
  WNW: '#84cc16', NW: '#06b6d4', Brahmasthan: '#facc15',
};

const shortDevtaName = (name: string) => name.split('(')[0].trim().split(/\s+/)[0].slice(0, 8).toUpperCase();


function toRad(deg: number) {
  return ((deg - 90) * Math.PI) / 180;
}

function polar(angle: number, r: number) {
  return { x: CX + r * Math.cos(toRad(angle)), y: CY + r * Math.sin(toRad(angle)) };
}

function slicePath(start: number, end: number, r1: number, r2: number) {
  const s1 = polar(start, r1), s2 = polar(start, r2);
  const e2 = polar(end, r2), e1 = polar(end, r1);
  return `M ${s1.x} ${s1.y} L ${s2.x} ${s2.y} A ${r2} ${r2} 0 0 1 ${e2.x} ${e2.y} L ${e1.x} ${e1.y} A ${r1} ${r1} 0 0 0 ${s1.x} ${s1.y} Z`;
}

interface Props {
  selectedSlice: string | null;
  onSliceClick: (slice: string) => void;
}

export default function VastuChakra({ selectedSlice, onSliceClick }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const selectedZone = selectedSlice ? SLICE_TO_ZONE[selectedSlice] : null;

  return (
    <svg viewBox="0 0 700 700" className="w-full max-w-[600px] mx-auto" role="img" aria-label="Vastu Chakra Wheel">
      {/* Outer zone ring */}
      <circle cx={CX} cy={CY} r={ZONE_OUTER} fill="none" stroke="hsl(var(--border))" strokeWidth="1" />
      <circle cx={CX} cy={CY} r={ZONE_INNER} fill="none" stroke="hsl(var(--border))" strokeWidth="1" />

      {/* Zone segments in outer ring */}
      {Object.entries(ZONE_ANGLES).map(([zone, angle]) => {
        const startAngle = angle - SLICE_ANGLE;
        const endAngle = angle + SLICE_ANGLE;
        const isSelected = selectedZone === zone;

        // radial lines for zone boundaries
        const innerPt = polar(startAngle, ZONE_INNER);
        const outerPt = polar(startAngle, ZONE_OUTER);

        const midAngle = angle;
        const labelR = (ZONE_INNER + ZONE_OUTER) / 2;
        const p = polar(midAngle, labelR - 8);
        const p2 = polar(midAngle, labelR + 10);
        const isBottom = midAngle > 90 && midAngle < 270;
        const info = ZONES[zone];

        return (
          <g key={`zone-${zone}`}>
            <line x1={innerPt.x} y1={innerPt.y} x2={outerPt.x} y2={outerPt.y}
              stroke="hsl(var(--border))" strokeWidth="0.5" />
            <path
              d={slicePath(startAngle, endAngle, ZONE_INNER, ZONE_OUTER)}
              fill={isSelected ? 'hsl(var(--primary) / 0.08)' : 'transparent'}
              className="pointer-events-none"
            />
            <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central"
              transform={`rotate(${isBottom ? midAngle + 180 : midAngle}, ${p.x}, ${p.y})`}
              className="text-[9px] font-bold pointer-events-none select-none"
              fill={isSelected ? 'hsl(var(--primary))' : 'hsl(var(--foreground))'}>
              {zone}
            </text>
            <text x={p2.x} y={p2.y} textAnchor="middle" dominantBaseline="central"
              transform={`rotate(${isBottom ? midAngle + 180 : midAngle}, ${p2.x}, ${p2.y})`}
              className="text-[6px] pointer-events-none select-none"
              fill="hsl(var(--muted-foreground))">
              {info?.aspects.join(' · ')}
            </text>
          </g>
        );
      })}


      {/* 45 Vastu Devtas ring */}
      <circle cx={CX} cy={CY} r={DEVTA_RING_OUTER} fill="none" stroke="hsl(var(--border))" strokeWidth="0.6" />
      <circle cx={CX} cy={CY} r={DEVTA_RING_INNER} fill="none" stroke="hsl(var(--border))" strokeWidth="0.6" />
      {(devtasData as any[]).map((devta) => {
        if (devta.zone === 'Brahmasthan') {
          return (
            <text
              key={`devta-${devta.no}`}
              x={CX}
              y={CY + 34}
              textAnchor="middle"
              dominantBaseline="central"
              className="text-[7px] font-semibold pointer-events-none select-none"
              fill="hsl(var(--foreground))"
            >
              BRAHMA
            </text>
          );
        }

        const degree = Number(devta.degree ?? 0);
        const mid = polar(degree, (DEVTA_RING_INNER + DEVTA_RING_OUTER) / 2);
        const dot = polar(degree, DEVTA_RING_OUTER - 3);
        const isBottom = degree > 90 && degree < 270;
        const zoneColor = DEVTA_ZONE_COLOR[devta.zone] || 'hsl(var(--muted))';

        return (
          <g key={`devta-${devta.no}`}>
            <circle cx={dot.x} cy={dot.y} r={1.8} fill={zoneColor} />
            <text
              x={mid.x}
              y={mid.y}
              textAnchor="middle"
              dominantBaseline="central"
              transform={`rotate(${isBottom ? degree + 180 : degree}, ${mid.x}, ${mid.y})`}
              className="text-[5.5px] font-semibold pointer-events-none select-none"
              fill="hsl(var(--foreground))"
            >
              {shortDevtaName(devta.devtaName)}
              <title>{`${devta.no}. ${devta.devtaName} · ${devta.degreeRange} · ${devta.zone}`}</title>
            </text>
          </g>
        );
      })}

      {/* Boundary circles for slices */}
      <circle cx={CX} cy={CY} r={SLICE_OUTER} fill="none" stroke="hsl(var(--border))" strokeWidth="1.5" />
      <circle cx={CX} cy={CY} r={SLICE_INNER} fill="none" stroke="hsl(var(--border))" strokeWidth="1" />

      {/* Radial lines from center to inner ring */}
      {Array.from({ length: 32 }, (_, i) => {
        const angle = i * SLICE_ANGLE;
        const inner = polar(angle, 15);
        const outer = polar(angle, SLICE_INNER);
        const isZoneBoundary = i % 2 === 0;
        return (
          <line key={`rl-${i}`} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
            stroke="hsl(var(--border))" strokeWidth={isZoneBoundary ? '0.8' : '0.4'} />
        );
      })}

      {/* 32 clickable slices */}
      {SLICES.map((label, i) => {
        const startAngle = i * SLICE_ANGLE;
        const endAngle = (i + 1) * SLICE_ANGLE;
        const isSelected = selectedSlice === label;
        const isHovered = hovered === label;

        let fill = i % 2 === 0 ? 'hsl(var(--secondary))' : 'hsl(var(--card))';
        if (isSelected) fill = 'hsl(var(--primary) / 0.3)';
        else if (isHovered) fill = 'hsl(var(--primary) / 0.1)';

        const midAngle = startAngle + SLICE_ANGLE / 2;
        const lp = polar(midAngle, LABEL_R);
        const isBottom = midAngle > 90 && midAngle < 270;

        return (
          <g key={label}>
            <path
              d={slicePath(startAngle, endAngle, SLICE_INNER, SLICE_OUTER)}
              fill={fill} stroke="hsl(var(--border))" strokeWidth="0.5"
              className="cursor-pointer transition-colors duration-150 outline-none"
              onClick={() => onSliceClick(label)}
              onMouseEnter={() => setHovered(label)}
              onMouseLeave={() => setHovered(null)}
              role="button" tabIndex={0} aria-label={`${label} – ${SLICE_TO_ZONE[label]}`}
              onKeyDown={(e) => e.key === 'Enter' && onSliceClick(label)}
              style={{ outline: 'none' }}
            />
            <text x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="central"
              transform={`rotate(${isBottom ? midAngle + 180 : midAngle}, ${lp.x}, ${lp.y})`}
              className="text-[9px] font-semibold pointer-events-none select-none"
              fill="hsl(var(--foreground))">
              {label}
            </text>
          </g>
        );
      })}

      {/* Center text */}
      <circle cx={CX} cy={CY} r={SLICE_INNER - 5} fill="hsl(var(--card))" />
      <text x={CX} y={CY - 10} textAnchor="middle" dominantBaseline="central"
        className="text-lg font-display font-bold pointer-events-none select-none"
        fill="hsl(var(--foreground))">Vastu</text>
      <text x={CX} y={CY + 14} textAnchor="middle" dominantBaseline="central"
        className="text-lg font-display font-bold pointer-events-none select-none"
        fill="hsl(var(--foreground))">Chakra</text>

      {/* Cardinal labels */}
      {([
        { l: 'N', a: 0 }, { l: 'E', a: 90 }, { l: 'S', a: 180 }, { l: 'W', a: 270 },
      ] as const).map(({ l, a }) => {
        const p = polar(a, ZONE_OUTER + 18);
        return (
          <text key={l} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central"
            className="text-sm font-bold pointer-events-none" fill="hsl(var(--primary))">
            {l}
          </text>
        );
      })}
    </svg>
  );
}
