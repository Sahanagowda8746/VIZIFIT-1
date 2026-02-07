import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface GenerateRequest {
  prompt: string;
  clothingType: string;
  complexity: 'simple' | 'detailed' | 'complex';
}

// Allowed values for validation
const ALLOWED_CLOTHING_TYPES = ['hoodie', 'tshirt', 't-shirt', 'dress', 'jacket', 'pants', 'jeans', 'sweater', 'shirt', 'shorts', 'skirt', 'coat'];
const ALLOWED_COMPLEXITY = ['simple', 'detailed', 'complex'];
const MAX_PROMPT_LENGTH = 500;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Authentication required', success: false }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication', success: false }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub;
    console.log(`Authenticated user: ${userId}`);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Service configuration error. Please try again later.", success: false }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { prompt, clothingType, complexity }: GenerateRequest = await req.json();

    // Input validation
    if (!prompt || typeof prompt !== 'string') {
      return new Response(
        JSON.stringify({ error: "Please provide a design description", success: false }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const trimmedPrompt = prompt.trim();
    if (trimmedPrompt.length === 0) {
      return new Response(
        JSON.stringify({ error: "Design description cannot be empty", success: false }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (trimmedPrompt.length > MAX_PROMPT_LENGTH) {
      return new Response(
        JSON.stringify({ error: `Design description must be ${MAX_PROMPT_LENGTH} characters or less`, success: false }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!clothingType || typeof clothingType !== 'string') {
      return new Response(
        JSON.stringify({ error: "Please select a clothing type", success: false }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const normalizedClothingType = clothingType.toLowerCase().trim();
    if (!ALLOWED_CLOTHING_TYPES.includes(normalizedClothingType)) {
      return new Response(
        JSON.stringify({ error: "Invalid clothing type selected", success: false }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!complexity || !ALLOWED_COMPLEXITY.includes(complexity)) {
      return new Response(
        JSON.stringify({ error: "Invalid complexity level", success: false }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sanitize prompt - remove control characters and excessive whitespace
    const sanitizedPrompt = trimmedPrompt
      .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
      .replace(/\s+/g, ' '); // Normalize whitespace

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

Clothing type: ${normalizedClothingType}
User design request: ${sanitizedPrompt}
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

    console.log(`User ${userId} generating fashion image with complexity: ${complexity}`);

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
      
      // Return user-friendly messages without exposing internal details
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please wait a moment and try again.", success: false }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later.", success: false }),
          { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to generate image. Please try again.", success: false }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log("AI response received successfully");

    // Extract the generated image
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const textResponse = data.choices?.[0]?.message?.content || "";

    if (!imageUrl) {
      console.error("No image in response:", JSON.stringify(data).substring(0, 500));
      return new Response(
        JSON.stringify({ error: "Failed to generate image. Please try again.", success: false }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
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
    // Return generic error message without exposing internal details
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again.", success: false }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
