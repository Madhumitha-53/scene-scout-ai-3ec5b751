import { Clapperboard, Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-card/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center">
              <Clapperboard className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-semibold">Scene Scout AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Scene Scout AI. Built with AI for filmmakers.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
