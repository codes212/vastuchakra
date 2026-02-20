import { useState, useMemo } from 'react';
import objectsVerdictsData from '@/data/objects-verdicts.json';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ObjectsPage() {
  const zones = useMemo(() => (objectsVerdictsData as any[]).map(o => o.Zones), []);
  const [selectedZone, setSelectedZone] = useState('');

  const data = (objectsVerdictsData as any[]).find(o => o.Zones === selectedZone);
  const objects = data
    ? Object.entries(data)
        .filter(([k]) => k.endsWith('_Verdict'))
        .map(([k, v]) => ({ name: k.replace('_Verdict', '').replace(/_/g, ' '), verdict: v as string }))
        .sort((a, b) => {
          const o: Record<string, number> = { Positive: 0, Neutral: 1, Negative: 2 };
          return (o[a.verdict] ?? 1) - (o[b.verdict] ?? 1);
        })
    : [];

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-display font-bold mb-2">Object & Room Checker</h1>
      <p className="text-sm text-muted-foreground mb-6">Check placement suitability of objects and rooms by zone</p>
      <Select value={selectedZone} onValueChange={setSelectedZone}>
        <SelectTrigger className="max-w-xs">
          <SelectValue placeholder="Select zone" />
        </SelectTrigger>
        <SelectContent>
          {zones.map((z: string) => <SelectItem key={z} value={z}>{z}</SelectItem>)}
        </SelectContent>
      </Select>
      {objects.length > 0 && (
        <div className="mt-6 space-y-2">
          {objects.map(obj => (
            <div key={obj.name} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
              <span className="text-sm">{obj.name}</span>
              <Badge className={
                obj.verdict === 'Positive' ? 'bg-positive/10 text-positive border-positive/20' :
                obj.verdict === 'Negative' ? 'bg-negative/10 text-negative border-negative/20' :
                'bg-muted text-muted-foreground border-border'
              }>
                {obj.verdict === 'Positive' ? '✅' : obj.verdict === 'Negative' ? '❌' : '⚪'} {obj.verdict}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
