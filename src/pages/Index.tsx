import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { AnalysisDashboard } from "@/components/AnalysisDashboard";
import { Footer } from "@/components/Footer";
import { useVideoAnalysis } from "@/hooks/useVideoAnalysis";

const Index = () => {
  const { analyzeVideos, isAnalyzing, result, clearResult } = useVideoAnalysis();

  const handleAnalyze = async (
    files: File[],
    analysisType: "full_movie" | "scene" | "takes"
  ) => {
    await analyzeVideos(files, analysisType);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
        {result && (
          <AnalysisDashboard result={result} onReanalyze={clearResult} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
