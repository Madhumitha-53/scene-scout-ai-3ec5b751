import { useState } from "react";
import { Play, ArrowRight, Film, Clock, Award, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadZone } from "./UploadZone";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface HeroSectionProps {
  onAnalyze: (files: File[], analysisType: "full_movie" | "scene" | "takes") => void;
  isAnalyzing?: boolean;
}

export function HeroSection({ onAnalyze, isAnalyzing }: HeroSectionProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [analysisType, setAnalysisType] = useState<"full_movie" | "scene" | "takes">("full_movie");

  const features = [
    { icon: <Zap className="w-5 h-5" />, label: "Instant Analysis" },
    { icon: <Film className="w-5 h-5" />, label: "Scene Detection" },
    { icon: <Award className="w-5 h-5" />, label: "Best Take Selection" },
    { icon: <Clock className="w-5 h-5" />, label: "Save Hours" },
  ];

  const handleAnalyze = () => {
    if (files.length > 0) {
      onAnalyze(files, analysisType);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <section className="relative overflow-hidden bg-gradient-hero film-grain">
      {/* Decorative film strip */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
        <svg viewBox="0 0 400 400" className="w-full h-full">
          <defs>
            <pattern id="film-strip" patternUnits="userSpaceOnUse" width="40" height="60">
              <rect width="40" height="60" fill="none" stroke="currentColor" strokeWidth="1" />
              <rect x="5" y="5" width="8" height="8" fill="currentColor" />
              <rect x="27" y="5" width="8" height="8" fill="currentColor" />
              <rect x="5" y="47" width="8" height="8" fill="currentColor" />
              <rect x="27" y="47" width="8" height="8" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="400" height="400" fill="url(#film-strip)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-8 slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border shadow-soft">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-sm font-medium">AI-Powered Video Analysis</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Your Personal{" "}
              <span className="text-gradient-gold">Film Director</span>{" "}
              Assistant
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl">
              Analyze video performances in seconds. Get professional insights on dialogue,
              expressions, timing, and body language. Select the best takes with confidence.
            </p>

            <div className="flex flex-wrap gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    {feature.icon}
                  </div>
                  <span className="text-sm font-medium">{feature.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                variant="hero"
                size="xl"
                onClick={() => document.getElementById("file-input")?.click()}
                className="gap-2"
                disabled={isAnalyzing}
              >
                <Play className="w-5 h-5" />
                Upload Video
              </Button>
              <Button variant="hero-outline" size="xl" className="gap-2">
                See Demo
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Right side - Upload */}
          <div className="fade-in space-y-6" style={{ animationDelay: "0.3s" }}>
            <UploadZone
              onFilesSelected={(newFiles) => setFiles(prev => [...prev, ...newFiles])}
              files={files}
              onRemoveFile={handleRemoveFile}
            />

            {files.length > 0 && (
              <div className="space-y-4 p-5 bg-card rounded-xl border shadow-soft">
                <h3 className="font-semibold text-sm">Analysis Type</h3>
                <RadioGroup
                  value={analysisType}
                  onValueChange={(value) => setAnalysisType(value as typeof analysisType)}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="full_movie" id="full_movie" />
                    <Label htmlFor="full_movie" className="flex-1 cursor-pointer">
                      <span className="font-medium">Full Video Analysis</span>
                      <p className="text-xs text-muted-foreground">Automatically detect and analyze all scenes</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="scene" id="scene" />
                    <Label htmlFor="scene" className="flex-1 cursor-pointer">
                      <span className="font-medium">Single Scene</span>
                      <p className="text-xs text-muted-foreground">Analyze one specific scene in detail</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="takes" id="takes" />
                    <Label htmlFor="takes" className="flex-1 cursor-pointer">
                      <span className="font-medium">Compare Takes</span>
                      <p className="text-xs text-muted-foreground">Compare multiple takes and find the best one</p>
                    </Label>
                  </div>
                </RadioGroup>

                <Button
                  variant="hero"
                  size="lg"
                  onClick={handleAnalyze}
                  className="w-full"
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Analyze {files.length} {files.length === 1 ? "File" : "Files"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
