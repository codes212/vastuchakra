import { useState, useMemo } from 'react';
import objectsVerdictsData from '@/data/objects-verdicts.json';
import { ZONE_FULL_TO_SHORT } from '@/data/vastuData';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronRight } from 'lucide-react';

const verdictBadge = (verdict: string) => {
  const v = verdict?.toLowerCase();
  if (v === 'positive') return 'bg-positive/10 text-positive border-positive/20';
  if (v === 'negative') return 'bg-negative/10 text-negative border-negative/20';
  return 'bg-muted text-muted-foreground border-border';
};

const verdictIcon = (v: string) => {
  if (v?.toLowerCase() === 'positive') return '✅';
  if (v?.toLowerCase() === 'negative') return '❌';
  return '⚪';
};

export default function ObjectsPage() {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  // Build object-first hierarchy: { objectName: [{zone, verdict}] }
  const objectMap = useMemo(() => {
    const map: Record<string, { zone: string; verdict: string }[]> = {};
    (objectsVerdictsData as any[]).forEach(row => {
      const zone = row.Zones as string;
      Object.entries(row).forEach(([k, v]) => {
        if (!k.endsWith('_Verdict')) return;
        const objName = k.replace('_Verdict', '').replace(/_/g, ' ');
        if (!map[objName]) map[objName] = [];
        map[objName].push({ zone, verdict: v as string });
      });
    });
    return map;
  }, []);

  const objectNames = useMemo(() =>
    Object.keys(objectMap)
      .filter(name => name.toLowerCase().includes(search.toLowerCase()))
      .sort(),
    [objectMap, search]
  );

  const toggle = (name: string) => setExpanded(prev => prev === name ? null : name);

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-display font-bold mb-2">Object & Room Checker</h1>
      <p className="text-sm text-muted-foreground mb-6">Check placement suitability of objects across all zones</p>
      <Input
        placeholder="Search objects..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-6 max-w-md"
      />
      <div className="space-y-1">
        {objectNames.map(name => {
          const isOpen = expanded === name;
          const zones = objectMap[name];
          const posCount = zones.filter(z => z.verdict === 'Positive').length;
          const negCount = zones.filter(z => z.verdict === 'Negative').length;
          return (
            <div key={name}>
              <button
                onClick={() => toggle(name)}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  {isOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                  <span className="text-sm font-medium">{name}</span>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="text-positive">✅ {posCount}</span>
                  <span className="text-negative">❌ {negCount}</span>
                </div>
              </button>
              {isOpen && (
                <div className="ml-7 mb-3 space-y-1">
                  {zones.sort((a, b) => {
                    const o: Record<string, number> = { Positive: 0, Neutral: 1, Negative: 2 };
                    return (o[a.verdict] ?? 1) - (o[b.verdict] ?? 1);
                  }).map(z => (
                    <div key={z.zone} className="flex items-center justify-between p-2 px-3 rounded-md border border-border bg-card">
                      <span className="text-sm text-muted-foreground">{z.zone}</span>
                      <Badge className={verdictBadge(z.verdict)}>
                        {verdictIcon(z.verdict)} {z.verdict}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {objectNames.length === 0 && (
        <p className="text-center text-muted-foreground mt-12">No objects found matching your search.</p>
      )}
    </div>
  );
}
