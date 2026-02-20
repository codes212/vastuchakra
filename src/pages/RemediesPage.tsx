import { useState } from 'react';
import remediesData from '@/data/remedies.json';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export default function RemediesPage() {
  const [search, setSearch] = useState('');
  const filtered = (remediesData as any[]).filter(r =>
    r.Remedies?.toLowerCase().includes(search.toLowerCase()) ||
    r.Effects?.toLowerCase().includes(search.toLowerCase()) ||
    r.Direction?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-display font-bold mb-2">Vastu Remedies</h1>
      <p className="text-sm text-muted-foreground mb-6">Browse remedies with placement, direction, and effects</p>
      <Input
        placeholder="Search remedies, effects, or direction..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-6 max-w-md"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((r: any, i: number) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-display font-bold">{r.Remedies}</h3>
                <Badge variant="outline" className="shrink-0">{r.Direction}</Badge>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">{r.Effects}</p>

              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                <div>
                  <p className="text-xs font-medium text-primary">Placement</p>
                  <p className="text-sm">{r.Placement}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-primary">Facing</p>
                  <p className="text-sm">{r.Facing || 'NA'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-primary">Element</p>
                  <p className="text-sm">{r.Element}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-primary">Planet</p>
                  <p className="text-sm">{r.Planet || 'NA'}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-xs font-medium text-primary mb-1">Zonal Energy</p>
                <p className="text-sm text-muted-foreground">{r['Zonal energy'] || 'NA'}</p>
              </div>

              <Separator />

              <div>
                <p className="text-xs font-medium text-primary mb-1">Benefit</p>
                <p className="text-sm">{r.Benefit || 'NA'}</p>
              </div>

              <Separator />

              {r.Addon && r.Addon !== 'NA' && (
                <div>
                  <p className="text-xs font-medium text-primary mb-1">Additional Recommendations</p>
                  <p className="text-sm text-muted-foreground">{r.Addon}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground mt-12">No remedies found matching your search.</p>
      )}
    </div>
  );
}
