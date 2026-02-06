import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface GenerateRequest {
  prompt: string;
  clothingType: string;
  complexity: 'simple' | 'detailed' | 'complex';
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { prompt, clothingType, complexity }: GenerateRequest = await req.json();

    if (!prompt || !clothingType) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: prompt and clothingType" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build complexity-specific style additions
    let complexityStyle = "";
    switch (complexity) {
      case 'simple':
        complexityStyle = "Minimalist modern clothing design, clean silhouette, everyday wear, neutral colors, studio background.";
        break;
      case 'detailed':
        complexityStyle = "Premium fashion garment with visible stitching, fabric texture, modern tailoring, catalog photography.";
        break;
      case 'complex':
        complexityStyle = "High-fashion designer outfit, layered fabrics, advanced tailoring, runway-ready but realistic, luxury aesthetic.";
        break;
    }

    // Build the comprehensive fashion image prompt
    const imagePrompt = `Generate a high-quality, photorealistic fashion design image for an e-commerce clothing brand called VIZIFIT.

The image must show ONLY the clothing item, clearly visible, centered, and well-lit.

Clothing type: ${clothingType}
User design request: ${prompt}
Style: modern, premium, high-fashion, wearable
Fit: realistic proportions, tailored fit
Fabric: detailed fabric texture (cotton, denim, leather, silk, or techwear fabric depending on item)
Color palette: elegant, neutral or trendy fashion colors

Background: clean studio background (white, light gray, or subtle gradient)

${complexityStyle}

Camera style: professional fashion catalog photo, sharp focus, high resolution
Lighting: soft studio lighting, natural shadows
Brand vibe: luxury fashion brand like Zara, SSENSE, Nike Lab

IMPORTANT:
- Do NOT add text, logos, or watermarks
- Do NOT generate random accessories unless requested
- The image must look suitable for a real online fashion store product page
- No distorted body parts
- No extra limbs
- No exaggerated poses
- No fantasy or sci-fi elements`;

    console.log("Generating fashion image with prompt:", imagePrompt.substring(0, 200) + "...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-pro-image-preview",
        messages: [
          {
            role: "user",
            content: imagePrompt,
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received successfully");

    // Extract the generated image
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const textResponse = data.choices?.[0]?.message?.content || "";

    if (!imageUrl) {
      console.error("No image in response:", JSON.stringify(data).substring(0, 500));
      throw new Error("No image was generated");
    }

    return new Response(
      JSON.stringify({ 
        imageUrl, 
        description: textResponse,
        success: true 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Generate fashion image error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage, success: false }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
