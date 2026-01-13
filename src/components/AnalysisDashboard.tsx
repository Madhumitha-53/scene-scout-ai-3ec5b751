import { useState } from "react";
import { AnalysisCard } from "./AnalysisCard";
import { TakeComparison } from "./TakeComparison";
import { ScoreRing } from "./ScoreRing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, RefreshCw, Share2, Lightbulb, TrendingUp, Clock } from "lucide-react";
import type { AnalysisResult } from "@/hooks/useVideoAnalysis";

interface AnalysisDashboardProps {
  result: AnalysisResult;
  onReanalyze?: () => void;
}

export function AnalysisDashboard({ result, onReanalyze }: AnalysisDashboardProps) {
  const [selectedScene, setSelectedScene] = useState<number | null>(null);

  const scenes = result.scenes || [];
  const takes = result.takes || [];
  const summary = result.summary;

  const hasTakes = takes.length > 0;
  const hasScenes = scenes.length > 0;

  return (
    <section className="bg-background py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 fade-in">
          <div>
            <h2 className="font-display text-3xl font-bold">Analysis Results</h2>
            <p className="text-muted-foreground mt-1">
              {result.videoName} • Analyzed {new Date(result.analyzedAt).toLocaleTimeString()}
            </p>
          </div>
          <div className="flex gap-3">
            {onReanalyze && (
              <Button variant="outline" size="sm" className="gap-2" onClick={onReanalyze}>
                <RefreshCw className="w-4 h-4" />
                Re-analyze
              </Button>
            )}
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button variant="gold" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-card fade-in" style={{ animationDelay: "0.1s" }}>
            <CardContent className="p-4 flex items-center gap-4">
              <ScoreRing score={summary.averageScore} size="sm" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Overall Score</p>
                <p className="font-display text-xl font-bold">{summary.averageScore}%</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card fade-in" style={{ animationDelay: "0.2s" }}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {hasTakes ? "Best Take" : "Best Scene"}
                </p>
                <p className="font-display text-xl font-bold">
                  {hasTakes ? `Take ${summary.bestTakeId}` : `Scene ${summary.bestScene}`}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card fade-in" style={{ animationDelay: "0.3s" }}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Suggestions</p>
                <p className="font-display text-xl font-bold">
                  {hasScenes ? scenes.reduce((acc, s) => acc + s.suggestions.length, 0) : takes.length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card fade-in" style={{ animationDelay: "0.4s" }}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {hasTakes ? "Takes" : "Scenes"}
                </p>
                <p className="font-display text-xl font-bold">
                  {hasTakes ? takes.length : scenes.length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue={hasScenes ? "scenes" : "takes"} className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            {hasScenes && (
              <TabsTrigger value="scenes" className="data-[state=active]:bg-card data-[state=active]:shadow-soft">
                Scene Analysis
              </TabsTrigger>
            )}
            {hasTakes && (
              <TabsTrigger value="takes" className="data-[state=active]:bg-card data-[state=active]:shadow-soft">
                Take Comparison
              </TabsTrigger>
            )}
          </TabsList>

          {hasScenes && (
            <TabsContent value="scenes" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scenes.map((scene, index) => (
                  <div
                    key={scene.sceneNumber}
                    className="fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <AnalysisCard
                      {...scene}
                      isSelected={selectedScene === scene.sceneNumber}
                      onClick={() => setSelectedScene(scene.sceneNumber)}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
          )}

          {hasTakes && (
            <TabsContent value="takes">
              <TakeComparison takes={takes} bestTakeId={summary.bestTakeId} />
            </TabsContent>
          )}
        </Tabs>

        {/* Director's Notes */}
        <Card className="mt-8 bg-gradient-card border-primary/20 fade-in">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Director's Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                <h4 className="font-semibold text-success mb-2">Top Strength</h4>
                <p className="text-sm text-muted-foreground">{summary.topStrength}</p>
              </div>
              <div className="p-4 rounded-lg bg-warning/5 border border-warning/20">
                <h4 className="font-semibold text-warning mb-2">Key Focus Area</h4>
                <p className="text-sm text-muted-foreground">{summary.keyFocusArea}</p>
              </div>
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <h4 className="font-semibold text-primary mb-2">Recommendation</h4>
                <p className="text-sm text-muted-foreground">{summary.recommendation}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
