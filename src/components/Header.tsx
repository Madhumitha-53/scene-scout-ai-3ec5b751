import { Scan, Sparkles } from "lucide-react";

export const Header = () => {
  return (
    <header className="relative py-12 text-center">
      {/* Background glow effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
      </div>
      
      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="relative">
            <Scan className="w-12 h-12 text-primary" />
            <Sparkles className="w-5 h-5 text-accent absolute -top-1 -right-1 animate-pulse" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold">
          <span className="gradient-text">Scene Scout</span>
          <span className="text-foreground"> AI</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Upload a video and let AI analyze scenes, objects, actions, and mood with precision
        </p>
      </div>
    </header>
  );
};
