import { useState, useRef, useCallback } from "react";
import { Upload, Film, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoUploaderProps {
  onVideoSelect: (file: File, thumbnail: string) => void;
  isAnalyzing: boolean;
}

export const VideoUploader = ({ onVideoSelect, isAnalyzing }: VideoUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const extractThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.muted = true;
      video.playsInline = true;

      video.onloadeddata = () => {
        video.currentTime = Math.min(1, video.duration / 2);
      };

      video.onseeked = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(video, 0, 0);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
        URL.revokeObjectURL(video.src);
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("video/")) {
      alert("Please upload a video file");
      return;
    }

    setVideoFile(file);
    const thumbnail = await extractThumbnail(file);
    setPreview(thumbnail);
    onVideoSelect(file, thumbnail);
  }, [onVideoSelect]);

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
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const clearVideo = () => {
    setPreview(null);
    setVideoFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {preview ? (
        <div className="relative group">
          <div className="glass rounded-xl overflow-hidden">
            <img 
              src={preview} 
              alt="Video thumbnail" 
              className="w-full aspect-video object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute bottom-4 left-4 flex items-center gap-2 text-foreground">
              <Film className="w-5 h-5 text-primary" />
              <span className="font-medium truncate max-w-[200px]">
                {videoFile?.name}
              </span>
            </div>
            {!isAnalyzing && (
              <button
                onClick={clearVideo}
                className="absolute top-4 right-4 p-2 rounded-full bg-destructive/80 hover:bg-destructive transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            {isAnalyzing && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-2 border-primary/30" />
                    <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  </div>
                  <span className="text-primary font-medium">Analyzing video...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "relative cursor-pointer transition-all duration-300",
            "border-2 border-dashed rounded-xl p-12",
            "flex flex-col items-center justify-center gap-4",
            "hover:border-primary/60 hover:bg-primary/5",
            dragActive 
              ? "border-primary bg-primary/10 glow-primary" 
              : "border-border/60 bg-card/30"
          )}
        >
          <div className={cn(
            "p-4 rounded-full transition-all duration-300",
            dragActive ? "bg-primary/20" : "bg-secondary"
          )}>
            <Upload className={cn(
              "w-8 h-8 transition-colors",
              dragActive ? "text-primary" : "text-muted-foreground"
            )} />
          </div>
          <div className="text-center">
            <p className="font-semibold text-lg">
              {dragActive ? "Drop your video here" : "Upload a video to analyze"}
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              Drag & drop or click to browse
            </p>
            <p className="text-muted-foreground/60 text-xs mt-2">
              MP4, MOV, WebM, AVI supported
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="video/*"
            onChange={handleChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};
