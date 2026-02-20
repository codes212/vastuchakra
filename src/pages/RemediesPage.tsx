import { useState } from 'react';
import remediesData from '@/data/remedies.json';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function RemediesPage() {
  const [search, setSearch] = useState('');
  const filtered = (remediesData as any[]).filter(r =>
    r.Remedies?.toLowerCase().includes(search.toLowerCase()) ||
    r.Effects?.toLowerCase().includes(search.toLowerCase()) ||
    r.Direction?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-display font-bold mb-2">Vastu Remedies</h1>
      <p className="text-sm text-muted-foreground mb-6">Browse remedies with placement, direction, and effects</p>
      <Input
        placeholder="Search remedies, effects, or direction..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-6 max-w-md"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((r: any, i: number) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-display">{r.Remedies}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-3">{r.Effects}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <Badge variant="outline">📍 {r.Direction}</Badge>
                <Badge variant="outline">🪑 {r.Placement}</Badge>
                {r.Facing && r.Facing !== 'NA' && <Badge variant="outline">👁 {r.Facing}</Badge>}
                <Badge variant="secondary">{r.Element}</Badge>
              </div>
              {r.Benefit && (
                <p className="text-xs font-medium text-primary">💡 {r.Benefit}</p>
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
