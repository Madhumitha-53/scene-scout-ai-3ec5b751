import { useState } from "react";
import { Header } from "@/components/Header";
import { VideoUploader } from "@/components/VideoUploader";
import { AnalysisResults } from "@/components/AnalysisResults";
import { useVideoAnalysis } from "@/hooks/useVideoAnalysis";
import { Button } from "@/components/ui/button";
import { RotateCcw, Zap } from "lucide-react";

const Index = () => {
  const { isAnalyzing, analysis, error, analyzeVideo, reset } = useVideoAnalysis();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<string>("");

  const handleVideoSelect = (file: File, thumb: string) => {
    setSelectedFile(file);
    setThumbnail(thumb);
    reset();
  };

  const handleAnalyze = () => {
    if (selectedFile) {
      analyzeVideo(selectedFile);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setThumbnail("");
    reset();
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle grid background */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px"
        }}
      />
      
      <div className="relative z-10 container mx-auto px-4 pb-20">
        <Header />

        <main className="space-y-8">
          <VideoUploader 
            onVideoSelect={handleVideoSelect} 
            isAnalyzing={isAnalyzing} 
          />

          {selectedFile && !analysis && !isAnalyzing && (
            <div className="flex justify-center">
              <Button 
                onClick={handleAnalyze}
                size="lg"
                className="gap-2 px-8 py-6 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground glow-primary"
              >
                <Zap className="w-5 h-5" />
                Analyze Video
              </Button>
            </div>
          )}

          {error && (
            <div className="max-w-2xl mx-auto p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-center">
              <p className="text-destructive">{error}</p>
              <Button 
                variant="outline" 
                onClick={handleReset} 
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          )}

          {analysis && (
            <>
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Analyze Another Video
                </Button>
              </div>
              <AnalysisResults data={analysis} />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
