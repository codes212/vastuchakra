import { useState } from 'react';
import VastuChakra from '@/components/VastuChakra';
import ZoneDetailPanel from '@/components/ZoneDetailPanel';
import { SLICE_TO_ZONE, INNER_CORNER_DEVTAS, INNER_CARDINAL_DEVTAS } from '@/data/vastuData';

// Map inner devta names to their zone based on degree ranges
function getZoneForInnerDevta(name: string): { sliceId: string; zoneName: string } | null {
  const allInner = [...INNER_CORNER_DEVTAS, ...INNER_CARDINAL_DEVTAS];
  const devta = allInner.find(d => d.name === name);
  if (!devta) return null;
  
  // Use midpoint to find direction/zone
  const span = devta.endDeg >= devta.startDeg ? devta.endDeg - devta.startDeg : 360 - devta.startDeg + devta.endDeg;
  const mid = devta.startDeg + span / 2;
  const normalizedMid = mid >= 360 ? mid - 360 : mid;
  
  // Map degrees to zone
  const zoneMap: { min: number; max: number; zone: string; slice: string }[] = [
    { min: 348.75, max: 360, zone: 'North', slice: 'N5' },
    { min: 0, max: 11.25, zone: 'North', slice: 'N5' },
    { min: 11.25, max: 33.75, zone: 'NNE', slice: 'N7' },
    { min: 33.75, max: 56.25, zone: 'NE', slice: 'E1' },
    { min: 56.25, max: 78.75, zone: 'ENE', slice: 'E3' },
    { min: 78.75, max: 101.25, zone: 'East', slice: 'E5' },
    { min: 101.25, max: 123.75, zone: 'ESE', slice: 'E7' },
    { min: 123.75, max: 146.25, zone: 'SE', slice: 'S1' },
    { min: 146.25, max: 168.75, zone: 'SSE', slice: 'S3' },
    { min: 168.75, max: 191.25, zone: 'South', slice: 'S5' },
    { min: 191.25, max: 213.75, zone: 'SSW', slice: 'S7' },
    { min: 213.75, max: 236.25, zone: 'SW', slice: 'W1' },
    { min: 236.25, max: 258.75, zone: 'WSW', slice: 'W3' },
    { min: 258.75, max: 281.25, zone: 'West', slice: 'W5' },
    { min: 281.25, max: 303.75, zone: 'WNW', slice: 'W7' },
    { min: 303.75, max: 326.25, zone: 'NW', slice: 'N1' },
    { min: 326.25, max: 348.75, zone: 'NNW', slice: 'N3' },
  ];

  for (const z of zoneMap) {
    if (normalizedMid >= z.min && normalizedMid < z.max) {
      return { sliceId: z.slice, zoneName: z.zone };
    }
  }
  return null;
}

export default function Index() {
  const [selectedSlice, setSelectedSlice] = useState<string | null>(null);
  const [selectedInnerDevta, setSelectedInnerDevta] = useState<string | null>(null);
  
  const zoneName = selectedSlice ? SLICE_TO_ZONE[selectedSlice] : null;

  const handleSliceClick = (slice: string) => {
    setSelectedSlice(slice);
    setSelectedInnerDevta(null);
  };

  const handleInnerDevtaClick = (devtaName: string) => {
    const mapped = getZoneForInnerDevta(devtaName);
    if (mapped) {
      setSelectedSlice(mapped.sliceId);
      setSelectedInnerDevta(devtaName);
    }
  };

  const handleClose = () => {
    setSelectedSlice(null);
    setSelectedInnerDevta(null);
  };

  return (
    <div className="flex flex-col lg:flex-row" style={{ height: 'calc(100vh - 56px)', overflow: 'hidden' }}>
      <div className="flex-1 flex items-center justify-center p-2 lg:p-4 min-h-0 overflow-hidden">
        <VastuChakra
          selectedSlice={selectedSlice}
          onSliceClick={handleSliceClick}
          onInnerDevtaClick={handleInnerDevtaClick}
          selectedInnerDevta={selectedInnerDevta}
        />
      </div>
      {selectedSlice && zoneName && (
        <div className="lg:w-[400px] xl:w-[440px] border-t lg:border-t-0 lg:border-l border-border bg-card shrink-0"
          style={{ maxHeight: 'calc(100vh - 56px)', overflow: 'hidden' }}>
          <ZoneDetailPanel sliceId={selectedSlice} zoneName={zoneName} onClose={handleClose} innerDevtaName={selectedInnerDevta} />
        </div>
      )}
    </div>
  );
}
