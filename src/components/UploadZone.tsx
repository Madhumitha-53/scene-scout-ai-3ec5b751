import { useCallback, useRef, useState } from "react";
import { Upload, Film, X, FileVideo } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  files?: File[];
  onRemoveFile?: (index: number) => void;
}

export function UploadZone({ onFilesSelected, files = [], onRemoveFile }: UploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;
    const videoFiles = Array.from(newFiles).filter(f => f.type.startsWith("video/"));
    if (videoFiles.length > 0) {
      onFilesSelected(videoFiles);
    }
  }, [onFilesSelected]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative cursor-pointer transition-all duration-300 rounded-2xl",
          "border-2 border-dashed p-10",
          "flex flex-col items-center justify-center gap-4 text-center",
          "bg-card hover:border-primary/40 hover:bg-muted/30",
          dragActive 
            ? "border-primary bg-primary/5 shadow-gold" 
            : "border-border"
        )}
      >
        <div className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center transition-all",
          dragActive ? "bg-primary/20 scale-110" : "bg-muted"
        )}>
          <Upload className={cn(
            "w-8 h-8 transition-colors",
            dragActive ? "text-primary" : "text-muted-foreground"
          )} />
        </div>
        <div>
          <p className="font-semibold text-lg">
            {dragActive ? "Drop your videos here" : "Upload your videos"}
          </p>
          <p className="text-muted-foreground text-sm mt-1">
            Drag & drop or click to browse
          </p>
          <p className="text-muted-foreground/60 text-xs mt-2">
            MP4, MOV, WebM supported • Multiple files allowed
          </p>
        </div>
        <input
          ref={inputRef}
          id="file-input"
          type="file"
          accept="video/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-3 p-3 rounded-xl bg-card border shadow-soft"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileVideo className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              {onRemoveFile && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFile(idx);
                  }}
                  className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
