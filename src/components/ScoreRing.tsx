import { cn } from "@/lib/utils";

interface ScoreRingProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function ScoreRing({ score, size = "md", showLabel = false }: ScoreRingProps) {
  const sizeConfig = {
    sm: { svgSize: 48, strokeWidth: 4, fontSize: "text-sm" },
    md: { svgSize: 80, strokeWidth: 6, fontSize: "text-xl" },
    lg: { svgSize: 120, strokeWidth: 8, fontSize: "text-3xl" },
  };

  const config = sizeConfig[size];
  const radius = (config.svgSize - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = () => {
    if (score >= 80) return "text-success stroke-success";
    if (score >= 60) return "text-warning stroke-warning";
    return "text-destructive stroke-destructive";
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={config.svgSize}
        height={config.svgSize}
        viewBox={`0 0 ${config.svgSize} ${config.svgSize}`}
        className="-rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={config.svgSize / 2}
          cy={config.svgSize / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={config.strokeWidth}
          className="text-muted opacity-20"
        />
        {/* Score circle */}
        <circle
          cx={config.svgSize / 2}
          cy={config.svgSize / 2}
          r={radius}
          fill="none"
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
          className={cn("score-ring", getScoreColor())}
          style={{ 
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            "--score-offset": offset 
          } as React.CSSProperties}
        />
      </svg>
      <span className={cn(
        "absolute font-display font-bold",
        config.fontSize,
        getScoreColor().split(" ")[0]
      )}>
        {score}
      </span>
    </div>
  );
}
