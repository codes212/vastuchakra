import { useState } from 'react';
import entrancesData from '@/data/entrances.json';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

const directions = [
  'N1','N2','N3','N4','N5','N6','N7','N8',
  'E1','E2','E3','E4','E5','E6','E7','E8',
  'S1','S2','S3','S4','S5','S6','S7','S8',
  'W1','W2','W3','W4','W5','W6','W7','W8',
];

export default function EntrancePage() {
  const [selected, setSelected] = useState<string>('');
  const data = (entrancesData as any[]).find(e => e.direction === selected);

  return (
    <div className="p-4 lg:p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-display font-bold mb-2">Entrance Checker</h1>
      <p className="text-sm text-muted-foreground mb-6">Check the Vastu verdict for any entrance direction</p>
      <Select value={selected} onValueChange={setSelected}>
        <SelectTrigger className="max-w-xs">
          <SelectValue placeholder="Select entrance direction" />
        </SelectTrigger>
        <SelectContent>
          {directions.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
        </SelectContent>
      </Select>
      {data && (
        <Card className="mt-6">
          <CardContent className="pt-6 space-y-4">
            <Badge className={
              data.verdict === 'Positive' ? 'bg-positive/10 text-positive border-positive/20' :
              data.verdict === 'Negative' ? 'bg-negative/10 text-negative border-negative/20' :
              'bg-muted text-muted-foreground'
            }>
              {data.verdict === 'Positive' ? '✅' : data.verdict === 'Negative' ? '❌' : '⚪'} {data.verdict}
            </Badge>
            <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{data.writeup}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
