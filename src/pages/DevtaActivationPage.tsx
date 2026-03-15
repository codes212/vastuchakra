import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Flame, BookOpen, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import activationData from '@/data/DevtaActivation.json';

export default function DevtaActivationPage() {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = (activationData as any[]).filter(d =>
    d.devtaName?.toLowerCase().includes(search.toLowerCase()) ||
    d.header?.toLowerCase().includes(search.toLowerCase()) ||
    d.keyword?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-8 space-y-6 overflow-y-auto" style={{ height: 'calc(100vh - 56px)' }}>
      <div>
        <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">Devta Activation</h1>
        <p className="text-sm text-muted-foreground mt-1">Learn how to activate each Vastu Devta for positive energy</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search devtas, keywords..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((d: any) => (
          <Card
            key={d.devtaNumber}
            className={`transition-colors border ${expanded === d.devtaNumber ? 'border-primary/30' : 'hover:border-primary/20'}`}
          >
            <CardHeader
              className="pb-2 cursor-pointer"
              onClick={() => setExpanded(expanded === d.devtaNumber ? null : d.devtaNumber)}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base font-display truncate">{d.devtaName}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{d.header}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline" className="text-xs">#{d.devtaNumber}</Badge>
                </div>
              </div>
              {d.keyword && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {d.keyword.split(',').map((k: string) => (
                    <Badge key={k.trim()} variant="secondary" className="text-[10px]">{k.trim()}</Badge>
                  ))}
                </div>
              )}
            </CardHeader>

            {expanded === d.devtaNumber && (
              <CardContent className="pt-0">
                <Tabs defaultValue="about" className="w-full">
                  <TabsList className="w-full grid grid-cols-3 h-8">
                    <TabsTrigger value="about" className="text-xs gap-1">
                      <BookOpen className="w-3 h-3" /> About
                    </TabsTrigger>
                    <TabsTrigger value="activation" className="text-xs gap-1">
                      <Sparkles className="w-3 h-3" /> Activation
                    </TabsTrigger>
                    <TabsTrigger value="havan" className="text-xs gap-1">
                      <Flame className="w-3 h-3" /> Havan
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="about" className="mt-3">
                    <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                      {d.devtaWriteup}
                    </p>
                  </TabsContent>

                  <TabsContent value="activation" className="mt-3">
                    <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                      {d.activators}
                    </p>
                  </TabsContent>

                  <TabsContent value="havan" className="mt-3">
                    <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                      {d.havan}
                    </p>
                  </TabsContent>
                </Tabs>
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
