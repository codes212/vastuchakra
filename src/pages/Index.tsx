import { useState } from 'react';
import VastuChakra from '@/components/VastuChakra';
import ZoneDetailPanel from '@/components/ZoneDetailPanel';
import { SLICE_TO_ZONE } from '@/data/vastuData';

export default function Index() {
  const [selectedSlice, setSelectedSlice] = useState<string | null>(null);
  const zoneName = selectedSlice ? SLICE_TO_ZONE[selectedSlice] : null;

  return (
    <div className="flex flex-col lg:flex-row overflow-hidden" style={{ height: 'calc(100vh - 56px)' }}>
      <div className="flex-1 flex items-center justify-center p-2 lg:p-4 min-h-0 overflow-hidden">
        <VastuChakra selectedSlice={selectedSlice} onSliceClick={setSelectedSlice} />
      </div>
      {selectedSlice && zoneName && (
        <div className="lg:w-[400px] xl:w-[440px] border-t lg:border-t-0 lg:border-l border-border bg-card max-h-[50vh] lg:max-h-none overflow-y-auto">
          <ZoneDetailPanel sliceId={selectedSlice} zoneName={zoneName} onClose={() => setSelectedSlice(null)} />
        </div>
      )}
    </div>
  );
}
