import { Clapperboard, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold">
            <Clapperboard className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold leading-none">
              Scene Scout AI
            </h1>
            <p className="text-xs text-muted-foreground">
              Video Analysis Assistant
            </p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            How it works
          </a>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="hero" size="sm" className="gap-2">
            <Sparkles className="w-4 h-4" />
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
}
