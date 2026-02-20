import { ELEMENT_DETAILS } from '@/data/vastuData';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ELEMENTS = Object.entries(ELEMENT_DETAILS);

const COLOR_HEX: Record<string, string> = {
  Yellow: '#facc15',
  Beige: '#f5f5dc',
  Cream: '#fffdd0',
  Green: '#22c55e',
  Brown: '#8b5a2b',
  Blue: '#3b82f6',
  Black: '#111827',
  Red: '#ef4444',
  Purple: '#a855f7',
  Violet: '#8b5cf6',
  Orange: '#f97316',
  Pink: '#ec4899',
  White: '#f8fafc',
  Grey: '#9ca3af',
  Silver: '#c0c0c0',
  Gold: '#d4af37',
  Golden: '#d4af37',
  Wooden: '#966f33',
  Metallic: '#9ca3af',
  'Metallic Colors': '#9ca3af',
};

function ColorChip({ name }: { name: string }) {
  const color = COLOR_HEX[name] || '#94a3b8';
  return (
    <div className="inline-flex items-center gap-2 rounded-md border border-border px-2 py-1 text-xs bg-background">
      <span
        className="h-4 w-4 rounded-sm border border-border"
        style={{ backgroundColor: color }}
        aria-label={name}
      />
      <span>{name}</span>
    </div>
  );
}

export default function ColorsPage() {
  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-display font-bold mb-2">Element Colors</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Color palette and benefic/malefic categorization by element.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {ELEMENTS.map(([element, info]) => (
          <Card key={element}>
            <CardHeader>
              <CardTitle className="text-base font-display flex items-center gap-2">
                {element}
                <Badge variant="outline">{info.directions.length} zones</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-medium mb-2">Benefic Colors</p>
                <div className="flex flex-wrap gap-2">
                  {info.beneficColors.map((name) => <ColorChip key={`${element}-b-${name}`} name={name} />)}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium mb-2">Malefic Colors</p>
                <div className="flex flex-wrap gap-2">
                  {info.maleficColors.map((name) => <ColorChip key={`${element}-m-${name}`} name={name} />)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
