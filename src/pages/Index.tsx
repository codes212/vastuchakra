import { useState } from 'react';
import VastuChakra from '@/components/VastuChakra';
import ZoneDetailPanel from '@/components/ZoneDetailPanel';
import { SLICE_TO_ZONE } from '@/data/vastuData';

export default function Index() {
  const [selectedSlice, setSelectedSlice] = useState<string | null>(null);
  const zoneName = selectedSlice ? SLICE_TO_ZONE[selectedSlice] : null;

  return (
    <div className="flex flex-col lg:flex-row" style={{ height: 'calc(100vh - 56px)' }}>
      <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-8 min-h-0 overflow-hidden">
        <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-1 text-center">
          Interactive Vastu Chakra
        </h1>
        <p className="text-sm text-muted-foreground mb-4 text-center">
          Click any slice to explore zone details
        </p>
        <div className="flex-1 flex items-center justify-center min-h-0 w-full">
          <VastuChakra selectedSlice={selectedSlice} onSliceClick={setSelectedSlice} />
        </div>
      </div>
      {selectedSlice && zoneName && (
        <div className="lg:w-[400px] xl:w-[440px] border-t lg:border-t-0 lg:border-l border-border bg-card max-h-[50vh] lg:max-h-none overflow-y-auto">
          <ZoneDetailPanel sliceId={selectedSlice} zoneName={zoneName} onClose={() => setSelectedSlice(null)} />
        </div>
      )}
    </div>
  );
}
