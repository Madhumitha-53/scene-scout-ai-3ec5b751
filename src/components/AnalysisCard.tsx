import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreRing } from "./ScoreRing";
import { MessageSquare, Smile, Timer, Move, CheckCircle, AlertCircle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SceneAnalysis } from "@/hooks/useVideoAnalysis";

export const metricIcons = {
  dialogue: <MessageSquare className="w-4 h-4" />,
  expression: <Smile className="w-4 h-4" />,
  timing: <Timer className="w-4 h-4" />,
  movement: <Move className="w-4 h-4" />,
};

interface AnalysisCardProps extends SceneAnalysis {
  isSelected?: boolean;
  onClick?: () => void;
}

export function AnalysisCard({
  sceneNumber,
  sceneName,
  overallScore,
  metrics,
  strengths,
  weaknesses,
  suggestions,
  isSelected,
  onClick,
}: AnalysisCardProps) {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-300 hover-lift bg-gradient-card",
        isSelected && "ring-2 ring-primary shadow-gold"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Scene {sceneNumber}
            </p>
            <CardTitle className="font-display text-lg">{sceneName}</CardTitle>
          </div>
          <ScoreRing score={overallScore} size="sm" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Metrics */}
        <div className="grid grid-cols-2 gap-2">
          {metrics.map((metric, idx) => (
            <div 
              key={idx}
              className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
            >
              <span className="text-primary">
                {metricIcons[metric.iconType] || metricIcons.dialogue}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground truncate">{metric.label}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all",
                        metric.score >= 80 ? "bg-success" : 
                        metric.score >= 60 ? "bg-warning" : "bg-destructive"
                      )}
                      style={{ width: `${metric.score}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium">{metric.score}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Strengths & Weaknesses */}
        <div className="space-y-2">
          {strengths.slice(0, 2).map((s, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-success mt-0.5 shrink-0" />
              <span className="text-muted-foreground">{s}</span>
            </div>
          ))}
          {weaknesses.slice(0, 1).map((w, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <AlertCircle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
              <span className="text-muted-foreground">{w}</span>
            </div>
          ))}
        </div>

        {/* Quick suggestion */}
        {suggestions[0] && (
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">{suggestions[0]}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
