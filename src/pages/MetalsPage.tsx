import { ELEMENT_DETAILS } from '@/data/vastuData';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ELEMENTS = Object.entries(ELEMENT_DETAILS);

export default function MetalsPage() {
  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-display font-bold mb-2">Element Metals</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Benefic and malefic metals by element, with related planets and directions.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {ELEMENTS.map(([element, info]) => (
          <Card key={element}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-display">{element}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs font-medium mb-1">Benefic Metals</p>
                <div className="flex flex-wrap gap-2">
                  {info.beneficMetals.map((metal) => <Badge key={`${element}-b-${metal}`} variant="secondary">{metal}</Badge>)}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium mb-1">Malefic Metals</p>
                <div className="flex flex-wrap gap-2">
                  {info.maleficMetals.map((metal) => <Badge key={`${element}-m-${metal}`} variant="outline">{metal}</Badge>)}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium mb-1">Planets</p>
                <p className="text-sm text-muted-foreground">{info.planets.join(', ')}</p>
              </div>
              <div>
                <p className="text-xs font-medium mb-1">Directions</p>
                <p className="text-sm text-muted-foreground">{info.directions.join(', ')}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
