import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InnerDevta, getZonesInRange, ZONES, ELEMENT_DETAILS } from '@/data/vastuData';
import devtasData from '@/data/VastuDevtas.json';
import { X } from 'lucide-react';

interface Props {
  devta: InnerDevta;
  onClose: () => void;
}

const COLOR_HEX: Record<string, string> = {
  Yellow: '#facc15', Beige: '#f5f5dc', Cream: '#fffdd0', Green: '#22c55e', Brown: '#8b5a2b',
  Blue: '#3b82f6', Black: '#111827', Red: '#ef4444', Purple: '#a855f7', Violet: '#8b5cf6',
  Orange: '#f97316', Pink: '#ec4899', White: '#f8fafc', Grey: '#9ca3af', Silver: '#c0c0c0',
  Gold: '#d4af37', Golden: '#d4af37', Wooden: '#966f33', Metallic: '#9ca3af', 'Metallic Colors': '#9ca3af',
};

const ColorChip = ({ name }: { name: string }) => (
  <div className="inline-flex items-center gap-2 rounded-md border border-border px-2 py-1 text-xs bg-background">
    <span className="h-4 w-4 rounded-sm border border-border" style={{ backgroundColor: COLOR_HEX[name] || '#94a3b8' }} />
    <span>{name}</span>
  </div>
);

export default function InnerDevtaPanel({ devta, onClose }: Props) {
  const coveredZones = getZonesInRange(devta.startDeg, devta.endDeg);
  const allAspects = coveredZones.flatMap(z => ZONES[z]?.aspects || []);
  const uniqueAspects = [...new Set(allAspects)];
  const allRelationships = coveredZones.map(z => ZONES[z]?.relationships).filter(Boolean);
  const elements = [...new Set(coveredZones.map(z => ZONES[z]?.element).filter(Boolean))];

  const devtaInfo = (devtasData as any[]).find(
    d => d.devtaName?.toLowerCase() === devta.name.toLowerCase()
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h2 className="text-lg font-display font-bold text-foreground">{devta.name}</h2>
          <p className="text-sm text-muted-foreground">
            Inner Devta · {devta.startDeg}° – {devta.endDeg}°
          </p>
        </div>
        <button onClick={onClose} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
        <TabsList className="mx-4 mt-3 flex-shrink-0 w-[calc(100%-2rem)] overflow-x-auto whitespace-nowrap justify-start">
          <TabsTrigger className="shrink-0" value="overview">Overview</TabsTrigger>
          <TabsTrigger className="shrink-0" value="devta">Devta</TabsTrigger>
          <TabsTrigger className="shrink-0" value="colors">Colors</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto p-4">
          <TabsContent value="overview" className="mt-0 space-y-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Covered Zones</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {coveredZones.map(z => <Badge key={z} variant="outline">{z}</Badge>)}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">All Zone Aspects</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {uniqueAspects.map(a => <Badge key={a} variant="secondary">{a}</Badge>)}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Relationships Governed</CardTitle></CardHeader>
              <CardContent className="space-y-1">
                {allRelationships.map((r, i) => (
                  <p key={i} className="text-sm text-muted-foreground">{r}</p>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Elements</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {elements.map(e => <Badge key={e} variant="outline">{e}</Badge>)}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devta" className="mt-0 space-y-4">
            {devtaInfo ? (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-display">{devtaInfo.devtaName}</CardTitle>
                  <p className="text-xs text-muted-foreground">Devta #{devtaInfo.devtaNumber}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                    {devtaInfo.devtaHint}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <p className="text-sm text-muted-foreground">No devta data available for {devta.name}.</p>
            )}
          </TabsContent>

          <TabsContent value="colors" className="mt-0 space-y-4">
            {elements.map(el => {
              const info = ELEMENT_DETAILS[el];
              if (!info) return null;
              return (
                <div key={el} className="space-y-4">
                  <h3 className="text-sm font-bold">{el} Element</h3>
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Benefic Colors</CardTitle></CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                      {info.beneficColors.map(c => <ColorChip key={`b-${el}-${c}`} name={c} />)}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Malefic Colors</CardTitle></CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                      {info.maleficColors.map(c => <ColorChip key={`m-${el}-${c}`} name={c} />)}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Metals & Planets</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Benefic Metals:</span> {info.beneficMetals.join(', ')}</p>
                      <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Malefic Metals:</span> {info.maleficMetals.join(', ')}</p>
                      <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Planets:</span> {info.planets.join(', ')}</p>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
