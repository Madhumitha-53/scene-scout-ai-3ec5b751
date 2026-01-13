import { Trophy, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { TakeAnalysis } from "@/hooks/useVideoAnalysis";

interface TakeComparisonProps {
  takes: TakeAnalysis[];
  bestTakeId?: string;
}

export function TakeComparison({ takes, bestTakeId }: TakeComparisonProps) {
  const sortedTakes = [...takes].sort((a, b) => b.score - a.score);
  const best = sortedTakes[0];

  return (
    <div className="space-y-6">
      {/* Best Take Highlight */}
      {best && (
        <Card className="bg-gradient-gold text-primary-foreground overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
                <Trophy className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <p className="text-sm opacity-80 uppercase tracking-wide">Best Take</p>
                <h3 className="font-display text-2xl font-bold">{best.name}</h3>
                <p className="text-sm opacity-80 mt-1">
                  Scored {best.score}% overall performance
                </p>
              </div>
              <div className="text-5xl font-display font-bold opacity-80">
                {best.score}%
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Takes */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedTakes.map((take, idx) => (
          <Card 
            key={take.id}
            className={cn(
              "transition-all hover-lift bg-gradient-card",
              take.id === best?.id && "ring-2 ring-primary"
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  {take.name}
                  {idx === 0 && <Star className="w-4 h-4 text-primary fill-primary" />}
                </CardTitle>
                <span className={cn(
                  "text-2xl font-display font-bold",
                  take.score >= 80 ? "text-success" :
                  take.score >= 60 ? "text-warning" : "text-destructive"
                )}>
                  {take.score}%
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {take.highlights.map((highlight, hIdx) => (
                  <li key={hIdx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
