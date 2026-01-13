import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AnalysisMetric {
  label: string;
  score: number;
  iconType: "dialogue" | "expression" | "timing" | "movement";
}

export interface SceneAnalysis {
  sceneNumber: number;
  sceneName: string;
  overallScore: number;
  metrics: AnalysisMetric[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface TakeAnalysis {
  id: string;
  name: string;
  score: number;
  highlights: string[];
}

export interface AnalysisSummary {
  averageScore: number;
  bestScene?: number;
  bestTakeId?: string;
  topStrength: string;
  keyFocusArea: string;
  recommendation: string;
}

export interface AnalysisResult {
  scenes?: SceneAnalysis[];
  takes?: TakeAnalysis[];
  summary: AnalysisSummary;
  videoName: string;
  analyzedAt: string;
}

type AnalysisType = "full_movie" | "scene" | "takes";

export function useVideoAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const extractFrames = async (file: File, numFrames = 6): Promise<string[]> => {
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

  const analyzeVideos = async (files: File[], analysisType: AnalysisType = "full_movie") => {
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const file = files[0];
      toast.info(`Processing ${file.name}...`);

      const frames = await extractFrames(file, 6);
      toast.info("Analyzing with AI...");

      const { data, error: fnError } = await supabase.functions.invoke("analyze-video", {
        body: { frames, videoName: file.name, analysisType }
      });

      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);

      const analysisResult: AnalysisResult = {
        scenes: data.result.scenes,
        takes: data.result.takes,
        summary: data.result.summary,
        videoName: file.name,
        analyzedAt: new Date().toISOString(),
      };

      setResult(analysisResult);
      toast.success("Analysis complete!");
      return analysisResult;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Analysis failed";
      setError(msg);
      toast.error(msg);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearResult = () => {
    setResult(null);
    setError(null);
  };

  return { analyzeVideos, clearResult, isAnalyzing, result, error };
}
