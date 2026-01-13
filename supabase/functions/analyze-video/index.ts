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
    const { frames } = await req.json();
    
    if (!frames || !Array.isArray(frames) || frames.length === 0) {
      return new Response(
        JSON.stringify({ error: "No video frames provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Analyzing ${frames.length} frames from uploaded video`);

    // Build image content parts for the AI model
    const imageContents = frames.map((frame: string, idx: number) => ({
      type: "image_url",
      image_url: {
        url: frame,
        detail: "high"
      }
    }));

    const systemPrompt = `You are an expert video analyst AI. You will analyze frames extracted from a video and provide a comprehensive analysis.

Your analysis must be based ONLY on what you can actually see in the provided frames. Be accurate and specific.

Return a JSON object with this exact structure:
{
  "summary": "A detailed 2-3 sentence summary of what the video appears to be about based on the frames",
  "scenes": [
    {"timestamp": "0:00-0:10", "description": "Description of what happens", "mood": "Mood/tone"},
    {"timestamp": "0:10-0:20", "description": "Description", "mood": "Mood"}
  ],
  "objects": ["list", "of", "specific", "objects", "visible"],
  "actions": ["list", "of", "actions", "or", "activities", "happening"],
  "colors": ["Dominant", "Color", "Names", "Like", "Blue", "Red"],
  "people": {
    "count": "number or range like '2-3' or 'none'",
    "description": "Brief description of people if visible, their activities, clothing etc."
  },
  "mood": "Overall emotional tone/atmosphere",
  "genre": "Type of content: e.g., 'Nature Documentary', 'Sports', 'Tutorial', 'Vlog', 'Animation', etc."
}

Be specific about what you see. If you cannot determine something, indicate that clearly.`;

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
              {
                type: "text",
                text: `These are ${frames.length} frames extracted from a video at regular intervals. Analyze them thoroughly to understand what the video contains. Provide detailed and accurate analysis based only on what you can see.`
              },
              ...imageContents
            ]
          }
        ],
        max_tokens: 2000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "API credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse JSON from response, handling potential markdown code blocks
    let analysisData;
    try {
      let jsonStr = content;
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1].trim();
      }
      analysisData = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Content:", content);
      // Return a structured fallback
      analysisData = {
        summary: content.substring(0, 500),
        scenes: [{ timestamp: "0:00", description: "Unable to parse detailed scenes", mood: "Unknown" }],
        objects: ["Video content"],
        actions: ["Activity detected"],
        colors: ["Various"],
        people: { count: "Unknown", description: "Unable to determine" },
        mood: "Undetermined",
        genre: "Video"
      };
    }

    console.log("Analysis complete");

    return new Response(
      JSON.stringify({ analysis: analysisData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in analyze-video:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Analysis failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
