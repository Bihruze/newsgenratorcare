import { GoogleGenerativeAI } from "@google/generative-ai";
import { AppState, GeneratedArticle } from "../types";
import { COIN_FACTS } from "./coinFacts";

const PROMO_TEMPLATE_FULL = `
Structure:
Section 1 (Informative Transition + Insight):
Write H2 about Promotional Coin follow trending of market and original article.
Write 1 sentences that expand on the article’s topic by providing helpful or interesting insight about the project (e.g., its latest update, potential, or relevance to market trends). Keep it educational — not promotional.
Start with a brief reference to the article’s topic (1 short sentence) to make it flow naturally.
Then add 1–5 sentences of helpful or interesting insight about the project ([Project Name]) — such as its latest update, market relevance, or ecosystem growth.
Tone: factual, educational, and consistent with the article — not overly promotional.

Section 2 (Informative CTA – must follow this structure): 
Write this section in a similar structure to the example below, but optimize the language so it fits naturally with the article’s topic and feels informative.
Keep all key elements (price analysis, buying guide, and official links) while making it sound relevant.
Format to follow exactly (optimize wording for the article):
If you're considering [Project Name], read our [Project Name] price analysis and be sure to check out our step-by-step guide to buying [Project Name] to build confidence and plan more accurately.
Stay updated on the latest news via [the [Project Name] official website], [X (Twitter)], and [Telegram channels].
Visit [the [Project Name] official website]
`;

const PROMO_TEMPLATE_CTA = `
Structure:
Section 1 (Informative Transition + Insight):
Write H2 about Promotional Coin follow trending of market and original article.
Write 1 sentences that expand on the article’s topic by providing helpful or interesting insight about the project (e.g., its latest update, potential, or relevance to market trends). Keep it educational — not promotional.
Start with a brief reference to the article’s topic (1 short sentence) to make it flow naturally.
Then add 1–5 sentences of helpful or interesting insight about the project ([Project Name]) — such as its latest update, market relevance, or ecosystem growth.
Tone: factual, educational, and consistent with the article — not overly promotional.

Section 2 (Informative CTA – must follow this structure): 
Format to follow exactly (optimize wording for the article):
Visit [the [Project Name] official website]
`;

export const generateArticle = async (
  scrapedContent: string[],
  state: AppState
): Promise<GeneratedArticle> => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

  // Select logic based on Promo Mode
  let promoInstruction = "";
  if (state.promoMode === 'Full') {
    promoInstruction = PROMO_TEMPLATE_FULL;
  } else if (state.promoMode === 'CTA Only') {
    promoInstruction = PROMO_TEMPLATE_CTA;
  }
  // If 'No CTA', promoInstruction remains empty

  const promoCoinName = state.promoCoin || "None";
  const promoOverride = state.customPromoText ? `\nOverride Promotional Text with:\n${state.customPromoText}` : "";

  // Retrieve factual data if available
  const coinFacts = COIN_FACTS[promoCoinName] || "";

  // Determine if we should effectively include promotional content
  // We include it if:
  // 1. PromoMode is NOT 'No CTA'
  // AND
  // 2. Either a Coin is selected (not 'None') OR Custom Text is provided
  const includePromo = state.promoMode !== 'No CTA' && (state.promoCoin !== 'None' || !!state.customPromoText);

  const systemInstruction = `
    You are an expert cryptocurrency news writer and SEO specialist.
    
    ROLE:
    Write as an authoritative source covering cryptocurrency-related topics. Use a casual and personable tone, and include crypto-specific slang to make the content relatable to the target audience (cryptocurrency enthusiasts). Keep the style talkative and conversational. Use quick, clever humor when it fits. Address the reader in the second person singular ("you").

    CRITICAL TONE RULES:
    1. **NO SELF-REFERENCE**: NEVER refer to yourself, "us", "we", "ourselves", or "I". The focus is entirely on the reader and the market.
    2. **NO QUESTIONS**: NEVER ask questions (rhetorical or otherwise). Do not ask "What does this mean for Bitcoin?". Instead, state "This signal indicates a shift for Bitcoin."
    3. **ANSWERS & WARNINGS**: Replace curiosity with certainty. Provide direct answers, actionable insights, and clear warnings.

    LANGUAGE RULES (Crucial):
    The meta title and meta description must always be written in the same language as the article, but the slug rules depend on the language.
    - English: meta title, meta description, slug → English
    - Japanese: meta title & meta description → Japanese, slug → English
    - Thai: meta title & meta description → Thai, slug → English
    - French: meta title, meta description, slug → French
    - German: meta title, meta description, slug → German
    - Turkish: meta title, meta description, slug → Turkish
    - Spanish: meta title, meta description, slug → Spanish
    - Italian: meta title, meta description, slug → Italian

    SEO CONSTRAINTS:
    - Meta Title: Must be between 50 and 60 characters.
    - Meta Description: Must be between 120 and 155 characters.

    IMAGE PROMPT GUIDELINES:
    The 'imagePrompt' field must be a highly detailed, professional text-to-image prompt optimized for photorealism.
    - Style: Ultra-realistic, Cinematic, 8k resolution, HDR, Professional Studio Lighting, Unreal Engine 5 render style.
    - Content: Visually represent the core news event (e.g., a bull run, a specific token symbol like XRP or BTC, a regulatory gavel, a digital graph).
    - Composition: Use dynamic angles, neon accents, futuristic blockchain data streams in the background, or dark/sleek financial environments.
    - Specificity: If the news mentions a specific price milestone or huge number (e.g. "$756M"), mention that this text should be "visible in glowing neon typography" within the image.
    - Example: "Photorealistic XRP coin being flooded by a powerful, glowing river of light with '$756M' visible, ultra-realistic photo capture with studio lighting, HDR quality, neon accents against dark green futuristic blockchain backdrop."

    LINK DEFINITIONS (HIGHEST PRIORITY):
    - The user provides specific "Anchor Text" and "URL" pairs to be included in the article.
    - Input Format: "Anchor: [Text] Link: [URL]" or similar key-value pairs.
    - You MUST extract the EXACT Anchor Text and the corresponding URL.
    - You MUST include the EXACT Anchor Text in the generated article content. Do NOT change, summarize, or paraphrase the Anchor Text.
    - You MUST link this Anchor Text to the provided URL using Markdown format: [Anchor Text](URL).
    - If the Anchor Text is a long sentence, headline, or phrase, insert it as a standalone sentence or a reference (e.g., "Related: [Anchor Text](URL)") if it does not fit naturally into a paragraph.
    - Do NOT search for a natural occurrence if it doesn't exist; instead, INSERT the Anchor Text to ensure the link is present.
    - Do this for EVERY defined link pair provided.
    
    OUTPUT FORMAT:
    You must output strictly valid JSON. Do not include markdown code blocks like \`\`\`json. Just the raw JSON string.

    JSON SCHEMA:
    {
      "title": "Main Article Title",
      "content": {
        "intro": "Introduction paragraph...",
        "sections": [
           {
             "heading": "Section Heading",
             "paragraphs": ["para 1", "para 2"]
           }
           ... produce exactly ${state.numSections} main sections ...
        ]
      },
      "seo": {
        "slug": "url-friendly-slug",
        "metaTitle": "SEO Title (50-60 chars)",
        "metaDescription": "SEO Description (120-155 chars)",
        "excerpt": "Short excerpt",
        "imagePrompt": "Detailed photorealistic image prompt adhering to guidelines above",
        "altText": "Alt text for the image"
      },
      "sources": [
        { "domain": "domain.com", "url": "full url" }
      ]
    }
  `;

  // Parse link definitions for context if needed, though instruction handles it generically
  const linkContext = state.linkDefinitions 
    ? `LINK DEFINITIONS (User provided Anchor Text and URLs in format "Anchor: ... Link: ..."):\n${state.linkDefinitions}` 
    : "No specific link definitions provided.";

  const userPrompt = `
    TASK: Generate a cryptocurrency news article based on the following source content and parameters.

    TARGET LANGUAGE: ${state.selectedLanguage}

    SOURCE CONTENT (Extracted via Jina):
    ${scrapedContent.join('\n\n--- NEXT SOURCE ---\n\n')}

    PARAMETERS:
    - Keywords: ${state.keywords}
    - News Angle/Focus: ${state.newsAngle}
    - Additional Instructions: ${state.additionalContent}
    - Number of Main Content Sections: ${state.numSections}
    
    ${linkContext}

    PROMOTIONAL CONTENT INSTRUCTIONS:
    - Promotional Coin: ${promoCoinName}
    - Mode: ${state.promoMode}
    
    FACTUAL DATA FOR ${promoCoinName}:
    ${includePromo && coinFacts ? coinFacts : "N/A"}

    ${includePromo ? promoInstruction : 'No promotional content required. Do NOT add a promotional section.'}
    ${includePromo ? promoOverride : ""}

    ${includePromo ? "If promotional content is required, append it as the LAST section of the article content." : ""}
  `;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
      }
    });

    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    const text = response.text();

    if (!text) throw new Error("No response from Gemini");

    // Clean up potential markdown blocks if the model ignores the strict instruction (safety net)
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(jsonStr) as GeneratedArticle;

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  const SEEDREAM_API_KEY = process.env.SEEDREAM_API_KEY || "";

  try {
    // Seedream Text-to-Image API
    const response = await fetch("https://api.seedream.ai/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SEEDREAM_API_KEY}`
      },
      body: JSON.stringify({
        prompt: prompt,
        model: "seedream-3.0",
        size: "1024x1024",
        n: 1
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Seedream API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();

    // Check if response contains base64 data
    if (data.data && data.data[0]) {
      if (data.data[0].b64_json) {
        return data.data[0].b64_json;
      }
      if (data.data[0].url) {
        // If URL is returned, fetch and convert to base64
        const imageResponse = await fetch(data.data[0].url);
        const blob = await imageResponse.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }
    }

    throw new Error("No image data received from Seedream API.");

  } catch (error) {
    console.error("Image Generation Error:", error);
    throw error;
  }
};
