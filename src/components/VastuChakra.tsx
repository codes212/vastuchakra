import { useState } from 'react';
import {
  SLICES, SLICE_ANGLE, SLICE_OFFSET, SLICE_TO_ZONE, SLICE_TO_DEVTA,
  ZONES, ZONE_ANGLES,
  INNER_CORNER_DEVTAS, INNER_CARDINAL_DEVTAS, InnerDevta
} from '@/data/vastuData';

const CX = 400, CY = 400;
// Ring radii (inside→out): Brahma center, inner devta ring, 32 slices, zone ring, degree ring
const BRAHMA_R = 45;
const INNER_R1 = 50, INNER_R2 = 130;
const SLICE_INNER = 135, SLICE_OUTER = 260, LABEL_R = 200;
const ZONE_INNER = 265, ZONE_OUTER = 330;
const DEG_INNER = 335, DEG_OUTER = 365;

function toRad(deg: number) {
  return ((deg - 90) * Math.PI) / 180;
}
function polar(angle: number, r: number) {
  return { x: CX + r * Math.cos(toRad(angle)), y: CY + r * Math.sin(toRad(angle)) };
}

function arcPath(start: number, end: number, r1: number, r2: number, largeArc = false) {
  const flag = largeArc ? 1 : 0;
  const s1 = polar(start, r1), s2 = polar(start, r2);
  const e2 = polar(end, r2), e1 = polar(end, r1);
  return `M ${s1.x} ${s1.y} L ${s2.x} ${s2.y} A ${r2} ${r2} 0 ${flag} 1 ${e2.x} ${e2.y} L ${e1.x} ${e1.y} A ${r1} ${r1} 0 ${flag} 0 ${s1.x} ${s1.y} Z`;
}

interface Props {
  selectedSlice: string | null;
  selectedInnerDevta: string | null;
  onSliceClick: (slice: string) => void;
  onInnerDevtaClick: (devta: InnerDevta) => void;
}

export default function VastuChakra({ selectedSlice, selectedInnerDevta, onSliceClick, onInnerDevtaClick }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [hoveredInner, setHoveredInner] = useState<string | null>(null);
  const selectedZone = selectedSlice ? SLICE_TO_ZONE[selectedSlice] : null;

  return (
    <svg viewBox="0 0 800 800" className="w-full max-w-[700px] mx-auto" role="img" aria-label="Vastu Chakra Wheel">
      {/* ===== Degree tick ring ===== */}
      <circle cx={CX} cy={CY} r={DEG_OUTER} fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" />
      <circle cx={CX} cy={CY} r={DEG_INNER} fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" />
      {Array.from({ length: 36 }, (_, i) => {
        const angle = i * 10;
        const p1 = polar(angle, DEG_INNER);
        const p2 = polar(angle, DEG_OUTER);
        const lp = polar(angle, DEG_OUTER + 14);
        const isBottom = angle > 90 && angle < 270;
        return (
          <g key={`deg-${i}`}>
            <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="hsl(var(--border))" strokeWidth="0.5" />
            <text x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="central"
              transform={`rotate(${isBottom ? angle + 180 : angle}, ${lp.x}, ${lp.y})`}
              className="text-[7px] pointer-events-none select-none" fill="hsl(var(--muted-foreground))">
              {angle}°
            </text>
          </g>
        );
      })}

      {/* ===== Outer zone ring (sub-directions + aspects) ===== */}
      <circle cx={CX} cy={CY} r={ZONE_OUTER} fill="none" stroke="hsl(var(--border))" strokeWidth="1" />
      <circle cx={CX} cy={CY} r={ZONE_INNER} fill="none" stroke="hsl(var(--border))" strokeWidth="1" />
      {Object.entries(ZONE_ANGLES).map(([zone, angle]) => {
        const startAngle = angle - SLICE_ANGLE;
        const endAngle = angle + SLICE_ANGLE;
        const isSelected = selectedZone === zone;
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
            <path d={arcPath(startAngle, endAngle, ZONE_INNER, ZONE_OUTER)}
              fill={isSelected ? 'hsl(var(--primary) / 0.08)' : 'transparent'}
              className="pointer-events-none" />
            <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central"
              transform={`rotate(${isBottom ? midAngle + 180 : midAngle}, ${p.x}, ${p.y})`}
              className="text-[8px] font-bold pointer-events-none select-none"
              fill={isSelected ? 'hsl(var(--primary))' : 'hsl(var(--foreground))'}>
              {zone}
            </text>
            <text x={p2.x} y={p2.y} textAnchor="middle" dominantBaseline="central"
              transform={`rotate(${isBottom ? midAngle + 180 : midAngle}, ${p2.x}, ${p2.y})`}
              className="text-[5.5px] pointer-events-none select-none"
              fill="hsl(var(--muted-foreground))">
              {info?.aspects.join(' · ')}
            </text>
          </g>
        );
      })}

      {/* ===== 32 clickable slices ring (with devta names) ===== */}
      <circle cx={CX} cy={CY} r={SLICE_OUTER} fill="none" stroke="hsl(var(--border))" strokeWidth="1.5" />
      <circle cx={CX} cy={CY} r={SLICE_INNER} fill="none" stroke="hsl(var(--border))" strokeWidth="1" />
      {/* Radial lines */}
      {Array.from({ length: 32 }, (_, i) => {
        const angle = i * SLICE_ANGLE + SLICE_OFFSET;
        const inner = polar(angle, SLICE_INNER);
        const outer = polar(angle, SLICE_OUTER);
        return (
          <line key={`rl-${i}`} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
            stroke="hsl(var(--border))" strokeWidth="0.4" />
        );
      })}
      {SLICES.map((label, i) => {
        const startAngle = i * SLICE_ANGLE + SLICE_OFFSET;
        const endAngle = (i + 1) * SLICE_ANGLE + SLICE_OFFSET;
        const isSelected = selectedSlice === label;
        const isHovered = hovered === label;
        const devtaName = SLICE_TO_DEVTA[label] || '';

        let fill = i % 2 === 0 ? 'hsl(var(--secondary))' : 'hsl(var(--card))';
        if (isSelected) fill = 'hsl(var(--primary) / 0.3)';
        else if (isHovered) fill = 'hsl(var(--primary) / 0.1)';

        const midAngle = startAngle + SLICE_ANGLE / 2;
        const sliceLp = polar(midAngle, SLICE_INNER + 38);
        const devtaLp = polar(midAngle, LABEL_R + 20);
        const isBottom = midAngle > 90 && midAngle < 270;

        return (
          <g key={label}>
            <path
              d={arcPath(startAngle, endAngle, SLICE_INNER, SLICE_OUTER)}
              fill={fill} stroke="hsl(var(--border))" strokeWidth="0.5"
              className="cursor-pointer transition-colors duration-150"
              onClick={() => onSliceClick(label)}
              onMouseEnter={() => setHovered(label)}
              onMouseLeave={() => setHovered(null)}
              role="button" tabIndex={0} aria-label={`${label} – ${devtaName} – ${SLICE_TO_ZONE[label]}`}
              onKeyDown={(e) => e.key === 'Enter' && onSliceClick(label)}
              style={{ outline: 'none' }}
            />
            <text x={sliceLp.x} y={sliceLp.y} textAnchor="middle" dominantBaseline="central"
              transform={`rotate(${isBottom ? midAngle + 180 : midAngle}, ${sliceLp.x}, ${sliceLp.y})`}
              className="text-[9px] font-bold pointer-events-none select-none"
              fill="hsl(var(--foreground))">
              {label}
            </text>
            <text x={devtaLp.x} y={devtaLp.y} textAnchor="middle" dominantBaseline="central"
              transform={`rotate(${isBottom ? midAngle + 180 : midAngle}, ${devtaLp.x}, ${devtaLp.y})`}
              className="text-[6.5px] pointer-events-none select-none"
              fill="hsl(var(--primary))">
              {devtaName}
            </text>
          </g>
        );
      })}

      {/* ===== Middle ring: Inner zone devtas ===== */}
      <circle cx={CX} cy={CY} r={INNER_R2} fill="none" stroke="hsl(var(--border))" strokeWidth="1" />
      <circle cx={CX} cy={CY} r={INNER_R1} fill="none" stroke="hsl(var(--border))" strokeWidth="1" />

      {/* Corner devtas (small arcs) — clickable */}
      {INNER_CORNER_DEVTAS.map((d) => {
        const mid = (d.startDeg + d.endDeg) / 2;
        const lp = polar(mid, (INNER_R1 + INNER_R2) / 2);
        const isBottom = mid > 90 && mid < 270;
        const innerPt = polar(d.startDeg, INNER_R1);
        const outerPt = polar(d.startDeg, INNER_R2);
        const isSelected = selectedInnerDevta === d.name;
        const isHov = hoveredInner === d.name;
        return (
          <g key={`inner-${d.name}`}>
            <path d={arcPath(d.startDeg, d.endDeg, INNER_R1, INNER_R2)}
              fill={isSelected ? 'hsl(var(--primary) / 0.3)' : isHov ? 'hsl(var(--primary) / 0.15)' : d.color}
              fillOpacity={isSelected || isHov ? 1 : 0.25}
              stroke="hsl(var(--border))" strokeWidth="0.5"
              className="cursor-pointer transition-colors duration-150"
              onClick={() => onInnerDevtaClick(d)}
              onMouseEnter={() => setHoveredInner(d.name)}
              onMouseLeave={() => setHoveredInner(null)}
              style={{ outline: 'none' }}
              role="button" tabIndex={0} aria-label={d.name}
              onKeyDown={(e) => e.key === 'Enter' && onInnerDevtaClick(d)}
            />
            <line x1={innerPt.x} y1={innerPt.y} x2={outerPt.x} y2={outerPt.y}
              stroke="hsl(var(--border))" strokeWidth="0.5" />
            <text x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="central"
              transform={`rotate(${isBottom ? mid + 180 : mid}, ${lp.x}, ${lp.y})`}
              className="text-[6px] font-semibold pointer-events-none select-none"
              fill="hsl(var(--foreground))">
              {d.name}
            </text>
          </g>
        );
      })}

      {/* Cardinal devtas (large arcs) — clickable */}
      {INNER_CARDINAL_DEVTAS.map((d) => {
        const span = d.endDeg >= d.startDeg ? d.endDeg - d.startDeg : 360 - d.startDeg + d.endDeg;
        const mid = d.startDeg + span / 2;
        const normalizedMid = mid >= 360 ? mid - 360 : mid;
        const lp = polar(normalizedMid, (INNER_R1 + INNER_R2) / 2);
        const isBottom = normalizedMid > 90 && normalizedMid < 270;
        const large = span > 180;
        const innerPt = polar(d.startDeg, INNER_R1);
        const outerPt = polar(d.startDeg, INNER_R2);
        const isSelected = selectedInnerDevta === d.name;
        const isHov = hoveredInner === d.name;
        return (
          <g key={`inner-card-${d.name}`}>
            <path d={arcPath(d.startDeg, d.endDeg, INNER_R1, INNER_R2, large)}
              fill={isSelected ? 'hsl(var(--primary) / 0.3)' : isHov ? 'hsl(var(--primary) / 0.15)' : d.color}
              fillOpacity={isSelected || isHov ? 1 : 0.2}
              stroke="hsl(var(--border))" strokeWidth="0.5"
              className="cursor-pointer transition-colors duration-150"
              onClick={() => onInnerDevtaClick(d)}
              onMouseEnter={() => setHoveredInner(d.name)}
              onMouseLeave={() => setHoveredInner(null)}
              style={{ outline: 'none' }}
              role="button" tabIndex={0} aria-label={d.name}
              onKeyDown={(e) => e.key === 'Enter' && onInnerDevtaClick(d)}
            />
            <line x1={innerPt.x} y1={innerPt.y} x2={outerPt.x} y2={outerPt.y}
              stroke="hsl(var(--border))" strokeWidth="0.5" />
            <text x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="central"
              transform={`rotate(${isBottom ? normalizedMid + 180 : normalizedMid}, ${lp.x}, ${lp.y})`}
              className="text-[8px] font-bold pointer-events-none select-none"
              fill="hsl(var(--foreground))">
              {d.name}
            </text>
          </g>
        );
      })}

      {/* ===== Brahma center ===== */}
      <circle cx={CX} cy={CY} r={BRAHMA_R} fill="hsl(45, 80%, 55%)" fillOpacity={0.3}
        stroke="hsl(var(--border))" strokeWidth="1" />
      <circle cx={CX} cy={CY} r={20} fill="hsl(45, 90%, 60%)" fillOpacity={0.5}
        stroke="hsl(var(--border))" strokeWidth="0.5" />
      <text x={CX} y={CY} textAnchor="middle" dominantBaseline="central"
        className="text-[9px] font-display font-bold pointer-events-none select-none"
        fill="hsl(var(--foreground))">BRAHMA</text>

      {/* Cardinal labels */}
      {([
        { l: 'N', a: 0 }, { l: 'E', a: 90 }, { l: 'S', a: 180 }, { l: 'W', a: 270 },
      ] as const).map(({ l, a }) => {
        const p = polar(a, DEG_OUTER + 28);
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
