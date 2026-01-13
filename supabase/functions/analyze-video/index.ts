import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { frames, videoName, analysisType } = await req.json();
    
    if (!frames || !Array.isArray(frames) || frames.length === 0) {
      return new Response(
        JSON.stringify({ error: "No video frames provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    console.log(`Analyzing ${frames.length} frames, type: ${analysisType}`);

    const imageContents = frames.map((frame: string) => ({
      type: "image_url",
      image_url: { url: frame, detail: "high" }
    }));

    const systemPrompt = `You are an expert film/video analyst AI. Analyze the video frames and return a JSON object with this structure:

{
  "scenes": [
    {
      "sceneNumber": 1,
      "sceneName": "Scene name/description",
      "overallScore": 85,
      "metrics": [
        {"label": "Dialogue Delivery", "score": 88, "iconType": "dialogue"},
        {"label": "Facial Expression", "score": 82, "iconType": "expression"},
        {"label": "Timing & Pacing", "score": 85, "iconType": "timing"},
        {"label": "Body Movement", "score": 80, "iconType": "movement"}
      ],
      "strengths": ["Strong emotional delivery", "Good camera angle"],
      "weaknesses": ["Slight timing issue"],
      "suggestions": ["Consider tighter framing"]
    }
  ],
  "summary": {
    "averageScore": 85,
    "bestScene": 1,
    "topStrength": "Excellent emotional range",
    "keyFocusArea": "Work on timing",
    "recommendation": "Overall strong performance"
  }
}

Analyze ONLY what you see. Be specific and professional.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              { type: "text", text: `Analyze these ${frames.length} frames from "${videoName || 'video'}". Analysis type: ${analysisType || 'full_movie'}. Provide detailed professional analysis.` },
              ...imageContents
            ]
          }
        ],
        max_tokens: 3000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    
    let analysisData;
    try {
      let jsonStr = content;
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) jsonStr = jsonMatch[1].trim();
      analysisData = JSON.parse(jsonStr);
    } catch {
      analysisData = {
        scenes: [{ sceneNumber: 1, sceneName: "Main Scene", overallScore: 75, metrics: [{ label: "Overall", score: 75, iconType: "dialogue" }], strengths: ["Content analyzed"], weaknesses: [], suggestions: [] }],
        summary: { averageScore: 75, bestScene: 1, topStrength: "Video content", keyFocusArea: "General review", recommendation: content.substring(0, 200) }
      };
    }

    return new Response(
      JSON.stringify({ success: true, result: analysisData, videoName, analyzedAt: new Date().toISOString() }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Analysis failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
