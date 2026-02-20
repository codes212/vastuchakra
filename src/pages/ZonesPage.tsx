import { ZONES, ZONE_ANGLES } from '@/data/vastuData';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ZONE_ORDER = Object.keys(ZONE_ANGLES);

export default function ZonesPage() {
  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-display font-bold mb-2">All Vastu Zones</h1>
      <p className="text-sm text-muted-foreground mb-6">16 directional zones and their governed aspects</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ZONE_ORDER.map(name => {
          const zone = ZONES[name];
          return (
            <Card key={name} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-display">{name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  {zone.aspects.map(a => <Badge key={a} variant="secondary" className="text-xs">{a}</Badge>)}
                </div>
                <p className="text-xs text-muted-foreground">{zone.relationships}</p>
                <Badge variant="outline" className="text-xs">{zone.element}</Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
