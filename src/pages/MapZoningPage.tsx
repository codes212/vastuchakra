import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, RotateCcw, ZoomIn, ZoomOut, Move } from 'lucide-react';
import { SLICES, SLICE_ANGLE, SLICE_OFFSET, ZONE_ANGLES, ZONES, SLICE_TO_ZONE, SLICE_TO_DEVTA } from '@/data/vastuData';

function toRad(deg: number) {
  return ((deg - 90) * Math.PI) / 180;
}

function polar(cx: number, cy: number, angle: number, r: number) {
  return { x: cx + r * Math.cos(toRad(angle)), y: cy + r * Math.sin(toRad(angle)) };
}

function arcPath(cx: number, cy: number, start: number, end: number, r1: number, r2: number) {
  const s1 = polar(cx, cy, start, r1), s2 = polar(cx, cy, start, r2);
  const e2 = polar(cx, cy, end, r2), e1 = polar(cx, cy, end, r1);
  return `M ${s1.x} ${s1.y} L ${s2.x} ${s2.y} A ${r2} ${r2} 0 0 1 ${e2.x} ${e2.y} L ${e1.x} ${e1.y} A ${r1} ${r1} 0 0 0 ${s1.x} ${s1.y} Z`;
}

export default function MapZoningPage() {
  const [image, setImage] = useState<string | null>(null);
  const [northDeg, setNorthDeg] = useState(0);
  const [opacity, setOpacity] = useState(70);
  const [scale, setScale] = useState(90);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) handleFile(file);
  }, [handleFile]);

  const CX = 300, CY = 300;
  const R1 = 100, R2 = 220, R3 = 260;

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-56px)] overflow-hidden">
      {/* Controls Panel */}
      <div className="lg:w-[280px] border-b lg:border-b-0 lg:border-r border-border bg-card overflow-y-auto shrink-0">
        <div className="p-4 space-y-4">
          <div>
            <h1 className="font-display text-lg font-bold text-foreground">Map Zoning</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Upload floor plan & overlay Vastu Chakra</p>
          </div>

          <div
            className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-foreground font-medium">Drop Floor Plan Here</p>
            <p className="text-xs text-muted-foreground mt-1">PNG · JPG · WEBP</p>
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </div>

          {image && (
            <>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">North Orientation</label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setNorthDeg(n => n - 10)}>
                    <RotateCcw className="w-3 h-3" />
                  </Button>
                  <input type="range" min="-180" max="180" value={northDeg}
                    onChange={(e) => setNorthDeg(+e.target.value)}
                    className="flex-1 accent-primary" />
                  <span className="text-xs font-semibold text-primary w-10 text-right">{northDeg}°</span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {[{ l: 'N', d: 0 }, { l: 'E', d: 90 }, { l: 'S', d: 180 }, { l: 'W', d: 270 }].map(({ l, d }) => (
                    <Button key={l} variant={northDeg === d ? 'default' : 'outline'} size="sm"
                      className="text-xs h-7" onClick={() => setNorthDeg(d)}>{l}</Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Overlay Opacity</label>
                <div className="flex items-center gap-2">
                  <input type="range" min="10" max="100" value={opacity}
                    onChange={(e) => setOpacity(+e.target.value)}
                    className="flex-1 accent-primary" />
                  <span className="text-xs font-semibold text-primary w-10 text-right">{opacity}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Chakra Scale</label>
                <div className="flex items-center gap-2">
                  <ZoomOut className="w-3 h-3 text-muted-foreground" />
                  <input type="range" min="30" max="200" value={scale}
                    onChange={(e) => setScale(+e.target.value)}
                    className="flex-1 accent-primary" />
                  <ZoomIn className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs font-semibold text-primary w-10 text-right">{scale}%</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative overflow-hidden bg-muted flex items-center justify-center">
        {!image ? (
          <div className="text-center opacity-40">
            <Move className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <p className="font-display text-lg text-muted-foreground">Upload Floor Plan to Begin</p>
            <p className="text-xs text-muted-foreground mt-1">Drag & drop or click upload</p>
          </div>
        ) : (
          <div className="relative" style={{ width: '100%', height: '100%' }}>
            <img src={image} alt="Floor plan" className="absolute inset-0 w-full h-full object-contain" />
            <svg
              viewBox="0 0 600 600"
              className="absolute inset-0 w-full h-full"
              style={{ opacity: opacity / 100 }}
            >
              <g transform={`translate(300,300) scale(${scale / 100}) rotate(${northDeg}) translate(-300,-300)`}>
                {/* Zone ring */}
                {Object.entries(ZONE_ANGLES).map(([zone, angle]) => {
                  const startAngle = angle - SLICE_ANGLE;
                  const endAngle = angle + SLICE_ANGLE;
                  const isSelected = selectedZone === zone;
                  const midAngle = angle;
                  const lp = polar(CX, CY, midAngle, (R2 + R3) / 2);
                  const isBottom = midAngle > 90 && midAngle < 270;
                  return (
                    <g key={`z-${zone}`}>
                      <path d={arcPath(CX, CY, startAngle, endAngle, R2, R3)}
                        fill={isSelected ? 'hsl(var(--primary) / 0.3)' : 'hsl(var(--primary) / 0.05)'}
                        stroke="hsl(var(--primary) / 0.4)" strokeWidth="0.5"
                        className="cursor-pointer"
                        onClick={() => setSelectedZone(isSelected ? null : zone)} />
                      <text x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="central"
                        transform={`rotate(${isBottom ? midAngle + 180 : midAngle}, ${lp.x}, ${lp.y})`}
                        className="text-[6px] font-bold pointer-events-none select-none"
                        fill="hsl(var(--primary))">{zone}</text>
                    </g>
                  );
                })}
                {/* 32 slices */}
                {SLICES.map((label, i) => {
                  const startAngle = i * SLICE_ANGLE + SLICE_OFFSET;
                  const endAngle = (i + 1) * SLICE_ANGLE + SLICE_OFFSET;
                  const midAngle = startAngle + SLICE_ANGLE / 2;
                  const lp = polar(CX, CY, midAngle, (R1 + R2) / 2);
                  const isBottom = midAngle > 90 && midAngle < 270;
                  return (
                    <g key={label}>
                      <path d={arcPath(CX, CY, startAngle, endAngle, R1, R2)}
                        fill={i % 2 === 0 ? 'hsl(var(--primary) / 0.08)' : 'hsl(var(--primary) / 0.03)'}
                        stroke="hsl(var(--primary) / 0.3)" strokeWidth="0.3" />
                      <text x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="central"
                        transform={`rotate(${isBottom ? midAngle + 180 : midAngle}, ${lp.x}, ${lp.y})`}
                        className="text-[5px] font-semibold pointer-events-none select-none"
                        fill="hsl(var(--primary))">{SLICE_TO_DEVTA[label] || label}</text>
                    </g>
                  );
                })}
                {/* Center */}
                <circle cx={CX} cy={CY} r={R1} fill="hsl(45, 80%, 55%)" fillOpacity={0.15}
                  stroke="hsl(var(--primary) / 0.4)" strokeWidth="0.5" />
                <text x={CX} y={CY} textAnchor="middle" dominantBaseline="central"
                  className="text-[7px] font-display font-bold pointer-events-none select-none"
                  fill="hsl(var(--primary))">BRAHMA</text>
                {/* Cardinal labels */}
                {[{ l: 'N', a: 0 }, { l: 'E', a: 90 }, { l: 'S', a: 180 }, { l: 'W', a: 270 }].map(({ l, a }) => {
                  const p = polar(CX, CY, a, R3 + 16);
                  return (
                    <text key={l} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central"
                      className="text-[10px] font-bold pointer-events-none"
                      fill="hsl(var(--primary))">{l}</text>
                  );
                })}
              </g>
            </svg>
          </div>
        )}

        {/* Selected zone info */}
        {selectedZone && ZONES[selectedZone] && (
          <div className="absolute bottom-4 left-4 right-4 lg:right-auto lg:max-w-sm">
            <Card className="bg-card/95 backdrop-blur-sm border-primary/20">
              <CardHeader className="pb-2 pt-3 px-4">
                <CardTitle className="text-sm font-display">{selectedZone}</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-3 space-y-1">
                <p className="text-xs text-muted-foreground">{ZONES[selectedZone].aspects.join(' · ')}</p>
                <p className="text-xs text-muted-foreground">{ZONES[selectedZone].relationships}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
