import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

export const useVideoAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const extractFrames = async (file: File, numFrames = 8): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.muted = true;
      video.playsInline = true;

      video.onerror = () => reject(new Error("Failed to load video"));

      video.onloadedmetadata = async () => {
        const duration = video.duration;
        const interval = duration / (numFrames + 1);
        const frames: string[] = [];
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }

        // Set reasonable dimensions to reduce payload size
        const maxDim = 512;
        const scale = Math.min(maxDim / video.videoWidth, maxDim / video.videoHeight, 1);
        canvas.width = Math.round(video.videoWidth * scale);
        canvas.height = Math.round(video.videoHeight * scale);

        const captureFrame = (time: number): Promise<string> => {
          return new Promise((res) => {
            video.currentTime = time;
            video.onseeked = () => {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              res(canvas.toDataURL("image/jpeg", 0.7));
            };
          });
        };

        try {
          for (let i = 1; i <= numFrames; i++) {
            const time = interval * i;
            const frame = await captureFrame(Math.min(time, duration - 0.1));
            frames.push(frame);
          }
          URL.revokeObjectURL(video.src);
          resolve(frames);
        } catch (err) {
          reject(err);
        }
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const analyzeVideo = async (file: File) => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      toast.info("Extracting frames from video...");
      const frames = await extractFrames(file, 6);
      
      toast.info("Sending frames for AI analysis...");
      
      const { data, error: fnError } = await supabase.functions.invoke("analyze-video", {
        body: { frames }
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.analysis) {
        setAnalysis(data.analysis);
        toast.success("Video analysis complete!");
      } else {
        throw new Error("No analysis data received");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to analyze video";
      setError(message);
      toast.error(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setAnalysis(null);
    setError(null);
  };

  return {
    isAnalyzing,
    analysis,
    error,
    analyzeVideo,
    reset
  };
};
