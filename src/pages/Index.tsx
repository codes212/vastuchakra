import { useState } from 'react';
import VastuChakra from '@/components/VastuChakra';
import ZoneDetailPanel from '@/components/ZoneDetailPanel';
import InnerDevtaPanel from '@/components/InnerDevtaPanel';
import { SLICE_TO_ZONE, InnerDevta } from '@/data/vastuData';

export default function Index() {
  const [selectedSlice, setSelectedSlice] = useState<string | null>(null);
  const [selectedInnerDevta, setSelectedInnerDevta] = useState<InnerDevta | null>(null);
  const zoneName = selectedSlice ? SLICE_TO_ZONE[selectedSlice] : null;

  const handleSliceClick = (slice: string) => {
    setSelectedSlice(slice);
    setSelectedInnerDevta(null);
  };

  const handleInnerDevtaClick = (devta: InnerDevta) => {
    setSelectedInnerDevta(devta);
    setSelectedSlice(null);
  };

  const handleClose = () => {
    setSelectedSlice(null);
    setSelectedInnerDevta(null);
  };

  const showPanel = (selectedSlice && zoneName) || selectedInnerDevta;

  return (
    <div className="flex flex-col lg:flex-row overflow-hidden" style={{ height: 'calc(100vh - 56px)' }}>
      <div className="flex-1 flex items-center justify-center p-2 lg:p-4 min-h-0 overflow-hidden">
        <VastuChakra
          selectedSlice={selectedSlice}
          selectedInnerDevta={selectedInnerDevta?.name || null}
          onSliceClick={handleSliceClick}
          onInnerDevtaClick={handleInnerDevtaClick}
        />
      </div>
      {showPanel && (
        <div className="lg:w-[400px] xl:w-[440px] border-t lg:border-t-0 lg:border-l border-border bg-card max-h-[50vh] lg:max-h-none overflow-y-auto">
          {selectedSlice && zoneName ? (
            <ZoneDetailPanel sliceId={selectedSlice} zoneName={zoneName} onClose={handleClose} />
          ) : selectedInnerDevta ? (
            <InnerDevtaPanel devta={selectedInnerDevta} onClose={handleClose} />
          ) : null}
        </div>
      )}
    </div>
  );
}
