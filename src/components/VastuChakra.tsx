import { useState } from 'react';
import { SLICES, SLICE_ANGLE, SLICE_TO_ZONE, ZONES, ZONE_ANGLES } from '@/data/vastuData';

const CX = 300, CY = 300;
const SLICE_OUTER = 260, SLICE_INNER = 110, LABEL_R = 190, ZONE_R = 80;

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
    <svg viewBox="0 0 600 600" className="w-full max-w-[540px] mx-auto" role="img" aria-label="Vastu Chakra Wheel">
      {/* Boundary circles */}
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
        const zone = SLICE_TO_ZONE[label];
        const isSelected = selectedSlice === label;
        const isZoneSelected = selectedZone === zone;
        const isHovered = hovered === label;

        let fill = i % 2 === 0 ? 'hsl(var(--secondary))' : 'hsl(var(--card))';
        if (isZoneSelected) fill = 'hsl(var(--primary) / 0.12)';
        if (isSelected) fill = 'hsl(var(--primary) / 0.28)';
        if (isHovered && !isSelected) fill = 'hsl(var(--primary) / 0.08)';

        const midAngle = startAngle + SLICE_ANGLE / 2;
        const lp = polar(midAngle, LABEL_R);
        const isBottom = midAngle > 90 && midAngle < 270;

        return (
          <g key={label}>
            <path
              d={slicePath(startAngle, endAngle, SLICE_INNER, SLICE_OUTER)}
              fill={fill} stroke="hsl(var(--border))" strokeWidth="0.5"
              className="cursor-pointer transition-all duration-150"
              onClick={() => onSliceClick(label)}
              onMouseEnter={() => setHovered(label)}
              onMouseLeave={() => setHovered(null)}
              role="button" tabIndex={0} aria-label={`${label} – ${zone}`}
              onKeyDown={(e) => e.key === 'Enter' && onSliceClick(label)}
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

      {/* Zone labels in inner ring */}
      {Object.entries(ZONE_ANGLES).map(([zone, angle]) => {
        const p = polar(angle, ZONE_R);
        const isBottom = angle > 90 && angle < 270;
        const info = ZONES[zone];
        return (
          <g key={`z-${zone}`}>
            <text x={p.x} y={p.y - 5} textAnchor="middle" dominantBaseline="central"
              transform={`rotate(${isBottom ? angle + 180 : angle}, ${p.x}, ${p.y - 5})`}
              className="text-[8px] font-bold pointer-events-none select-none"
              fill={selectedZone === zone ? 'hsl(var(--primary))' : 'hsl(var(--foreground))'}>
              {zone}
            </text>
            <text x={p.x} y={p.y + 6} textAnchor="middle" dominantBaseline="central"
              transform={`rotate(${isBottom ? angle + 180 : angle}, ${p.x}, ${p.y + 6})`}
              className="text-[5px] pointer-events-none select-none"
              fill="hsl(var(--muted-foreground))">
              {info?.aspects.join(' · ')}
            </text>
          </g>
        );
      })}

      {/* Cardinal labels */}
      {([
        { l: 'N', a: 0 }, { l: 'E', a: 90 }, { l: 'S', a: 180 }, { l: 'W', a: 270 },
      ] as const).map(({ l, a }) => {
        const p = polar(a, SLICE_OUTER + 18);
        return (
          <text key={l} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central"
            className="text-sm font-bold pointer-events-none" fill="hsl(var(--primary))">
            {l}
          </text>
        );
      })}

      {/* Center dot */}
      <circle cx={CX} cy={CY} r={7} fill="hsl(var(--primary))" />
      <circle cx={CX} cy={CY} r={3} fill="hsl(var(--primary-foreground))" />
    </svg>
  );
}
