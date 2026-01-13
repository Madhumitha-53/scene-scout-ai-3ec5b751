import { Eye, Palette, Users, Activity, Clock, Sparkles, Tag as TagIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalysisData {
  summary: string;
  scenes: Array<{
    timestamp: string;
    description: string;
    mood: string;
  }>;
  objects: string[];
  actions: string[];
  colors: string[];
  people: {
    count: string;
    description: string;
  };
  mood: string;
  genre: string;
}

interface AnalysisResultsProps {
  data: AnalysisData;
}

const SectionCard = ({ 
  icon: Icon, 
  title, 
  children,
  gradient = false 
}: { 
  icon: React.ElementType; 
  title: string; 
  children: React.ReactNode;
  gradient?: boolean;
}) => (
  <div className="glass rounded-xl p-5 transition-all duration-300 hover:border-primary/30">
    <div className="flex items-center gap-3 mb-4">
      <div className={cn(
        "p-2 rounded-lg",
        gradient ? "bg-gradient-to-br from-primary/20 to-accent/20" : "bg-primary/10"
      )}>
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
    </div>
    {children}
  </div>
);

const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="px-3 py-1.5 rounded-full text-sm bg-secondary text-secondary-foreground border border-border/50 inline-block">
    {children}
  </span>
);

export const AnalysisResults = ({ data }: AnalysisResultsProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in-50 duration-500">
      {/* Summary */}
      <div className="glass rounded-xl p-6 glow-primary">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary/30 to-accent/30">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-semibold text-xl gradient-text">AI Analysis Summary</h3>
        </div>
        <p className="text-foreground/90 leading-relaxed">{data.summary}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <span className="px-4 py-2 rounded-full bg-primary/20 text-primary font-medium text-sm">
            {data.mood}
          </span>
          <span className="px-4 py-2 rounded-full bg-accent/20 text-accent font-medium text-sm">
            {data.genre}
          </span>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scenes */}
        <SectionCard icon={Clock} title="Key Scenes" gradient>
          <div className="space-y-3">
            {data.scenes.map((scene, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-secondary/50 border border-border/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-primary font-mono text-sm">{scene.timestamp}</span>
                  <span className="text-xs text-muted-foreground px-2 py-1 rounded bg-background/50">
                    {scene.mood}
                  </span>
                </div>
                <p className="text-sm text-foreground/80">{scene.description}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Objects Detected */}
        <SectionCard icon={Eye} title="Objects Detected">
          <div className="flex flex-wrap gap-2">
            {data.objects.map((obj, idx) => (
              <Tag key={idx}>{obj}</Tag>
            ))}
          </div>
        </SectionCard>

        {/* Actions */}
        <SectionCard icon={Activity} title="Actions & Activities">
          <div className="flex flex-wrap gap-2">
            {data.actions.map((action, idx) => (
              <Tag key={idx}>{action}</Tag>
            ))}
          </div>
        </SectionCard>

        {/* People */}
        <SectionCard icon={Users} title="People Analysis">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary">{data.people.count}</span>
              <span className="text-muted-foreground">people detected</span>
            </div>
            <p className="text-sm text-foreground/80">{data.people.description}</p>
          </div>
        </SectionCard>

        {/* Colors */}
        <SectionCard icon={Palette} title="Color Palette">
          <div className="flex flex-wrap gap-2">
            {data.colors.map((color, idx) => (
              <div key={idx} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50">
                <div 
                  className="w-4 h-4 rounded-full border border-border" 
                  style={{ backgroundColor: color.toLowerCase() }}
                />
                <span className="text-sm">{color}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
};
