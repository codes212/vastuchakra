import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import devtasData from '@/data/VastuDevtas.json';
import { Search } from 'lucide-react';

export default function DevtasPage() {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = (devtasData as any[]).filter(d =>
    d.devtaName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">Vastu Devtas</h1>
        <p className="text-sm text-muted-foreground mt-1">45 deities governing the Vastu Purusha Mandala</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search devtas..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((d: any) => (
          <Card
            key={d.devtaNumber}
            className="cursor-pointer hover:border-primary/30 transition-colors"
            onClick={() => setExpanded(expanded === d.devtaNumber ? null : d.devtaNumber)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-display">{d.devtaName}</CardTitle>
                <Badge variant="outline">#{d.devtaNumber}</Badge>
              </div>
            </CardHeader>
            {expanded === d.devtaNumber && (
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                  {d.devtaHint}
                </p>
              </CardContent>
            )}
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No devtas found.</p>
        )}
      </div>
    </div>
  );
}
