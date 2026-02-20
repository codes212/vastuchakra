import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ZONES, ZONE_SHORT_TO_FULL } from '@/data/vastuData';
import entrancesData from '@/data/entrances.json';
import objectsVerdictsData from '@/data/objects-verdicts.json';
import objectsRoomsData from '@/data/objects-rooms.json';
import { X } from 'lucide-react';

interface Props {
  sliceId: string;
  zoneName: string;
  onClose: () => void;
}

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

export default function ZoneDetailPanel({ sliceId, zoneName, onClose }: Props) {
  const zone = ZONES[zoneName];
  const fullName = ZONE_SHORT_TO_FULL[zoneName] || zoneName;

  const entrance = (entrancesData as any[]).find(e => e.direction === sliceId);
  const objectVerdicts = (objectsVerdictsData as any[]).find(o => o.Zones === fullName);
  const objectRooms = (objectsRoomsData as any[]).find(o => o.Zones === fullName);

  const objects = objectVerdicts
    ? Object.entries(objectVerdicts)
        .filter(([k]) => k.endsWith('_Verdict'))
        .map(([k, v]) => ({ name: k.replace('_Verdict', '').replace(/_/g, ' '), verdict: v as string }))
        .sort((a, b) => {
          const o: Record<string, number> = { Positive: 0, Neutral: 1, Negative: 2 };
          return (o[a.verdict] ?? 1) - (o[b.verdict] ?? 1);
        })
    : [];

  const rooms = objectRooms
    ? Object.entries(objectRooms)
        .filter(([k]) => !['Zones', 'Element'].includes(k))
        .map(([name, value]) => ({ name, allowed: value as string }))
    : [];

  const hasEntrance = !!entrance;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h2 className="text-lg font-display font-bold text-foreground">{sliceId} · {zoneName}</h2>
          <p className="text-sm text-muted-foreground">{zone?.aspects.join(' · ')}</p>
        </div>
        <button onClick={onClose} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
        <TabsList className="mx-4 mt-3 flex-shrink-0">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="doavoid">Do / Avoid</TabsTrigger>
          <TabsTrigger value="objects">Objects</TabsTrigger>
          {hasEntrance && <TabsTrigger value="entrance">Entrance</TabsTrigger>}
        </TabsList>

        <div className="flex-1 overflow-y-auto p-4">
          <TabsContent value="overview" className="mt-0 space-y-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Zone Aspects</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {zone?.aspects.map(a => <Badge key={a} variant="secondary">{a}</Badge>)}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Relationships Governed</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">{zone?.relationships}</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Element</CardTitle></CardHeader>
              <CardContent><Badge variant="outline">{zone?.element}</Badge></CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="doavoid" className="mt-0 space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-2" style={{ color: 'hsl(var(--positive))' }}>✅ Suitable</h3>
              <div className="flex flex-wrap gap-2">
                {rooms.filter(r => r.allowed === 'Yes').map(r => (
                  <Badge key={r.name} className="bg-positive/10 text-positive border border-positive/20">{r.name}</Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2" style={{ color: 'hsl(var(--negative))' }}>❌ Avoid</h3>
              <div className="flex flex-wrap gap-2">
                {rooms.filter(r => r.allowed === 'No').map(r => (
                  <Badge key={r.name} className="bg-negative/10 text-negative border border-negative/20">{r.name}</Badge>
                ))}
              </div>
            </div>
            {rooms.some(r => r.allowed === 'CW' || r.allowed === 'ACW') && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">↻ Directional</h3>
                <div className="flex flex-wrap gap-2">
                  {rooms.filter(r => r.allowed === 'CW' || r.allowed === 'ACW').map(r => (
                    <Badge key={r.name} variant="outline">{r.name} ({r.allowed})</Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="objects" className="mt-0 space-y-2">
            {objects.map(obj => (
              <div key={obj.name} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
                <span className="text-sm">{obj.name}</span>
                <Badge className={verdictBadge(obj.verdict)}>
                  {verdictIcon(obj.verdict)} {obj.verdict}
                </Badge>
              </div>
            ))}
            {objects.length === 0 && <p className="text-sm text-muted-foreground">No object data for this zone.</p>}
          </TabsContent>

          {hasEntrance && (
            <TabsContent value="entrance" className="mt-0 space-y-4">
              <Badge className={verdictBadge(entrance.verdict)}>
                {verdictIcon(entrance.verdict)} {entrance.verdict}
              </Badge>
              <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{entrance.writeup}</p>
            </TabsContent>
          )}
        </div>
      </Tabs>
    </div>
  );
}
