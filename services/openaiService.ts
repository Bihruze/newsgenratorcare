import OpenAI from "openai";
import { AppState, GeneratedArticle } from "../types";
import { COIN_FACTS, COIN_LINKS } from "./coinFacts";

// PROMO_TEMPLATE_FULL will be generated dynamically with actual links
const getPromoTemplateFull = (coinName: string, language: string) => {
  const links = COIN_LINKS[coinName];
  if (!links) return "";

  // Language-specific anchor texts
  const anchorTexts: Record<string, {
    priceAnalysis: string;
    buyingGuide: string;
    officialSite: string;
    stayUpdated: string;
    visit: string;
  }> = {
    'English': {
      priceAnalysis: `${coinName} price analysis`,
      buyingGuide: `step-by-step guide to buying ${coinName}`,
      officialSite: `the ${coinName} official website`,
      stayUpdated: 'Stay updated on the latest news via',
      visit: 'Visit'
    },
    'Turkish': {
      priceAnalysis: `${coinName} fiyat analizi`,
      buyingGuide: `${coinName} satın alma rehberi`,
      officialSite: `${coinName} resmi web sitesi`,
      stayUpdated: 'En son haberlerden haberdar olun:',
      visit: 'Ziyaret edin:'
    },
    'German': {
      priceAnalysis: `${coinName} Preisanalyse`,
      buyingGuide: `Schritt-für-Schritt-Anleitung zum Kauf von ${coinName}`,
      officialSite: `die offizielle ${coinName} Website`,
      stayUpdated: 'Bleiben Sie über die neuesten Nachrichten informiert:',
      visit: 'Besuchen Sie'
    },
    'French': {
      priceAnalysis: `analyse du prix de ${coinName}`,
      buyingGuide: `guide d'achat de ${coinName}`,
      officialSite: `le site officiel de ${coinName}`,
      stayUpdated: 'Restez informé des dernières nouvelles via',
      visit: 'Visitez'
    },
    'Spanish': {
      priceAnalysis: `análisis de precio de ${coinName}`,
      buyingGuide: `guía paso a paso para comprar ${coinName}`,
      officialSite: `el sitio web oficial de ${coinName}`,
      stayUpdated: 'Mantente actualizado con las últimas noticias en',
      visit: 'Visita'
    },
    'Italian': {
      priceAnalysis: `analisi del prezzo di ${coinName}`,
      buyingGuide: `guida passo-passo per acquistare ${coinName}`,
      officialSite: `il sito ufficiale di ${coinName}`,
      visit: 'Visita'
    },
    'Japanese': {
      priceAnalysis: `${coinName}価格分析`,
      buyingGuide: `${coinName}購入ガイド`,
      officialSite: `${coinName}公式サイト`,
      stayUpdated: '最新ニュースをチェック:',
      visit: '公式サイトを訪問:'
    },
    'Thai': {
      priceAnalysis: `การวิเคราะห์ราคา ${coinName}`,
      buyingGuide: `คู่มือการซื้อ ${coinName}`,
      officialSite: `เว็บไซต์อย่างเป็นทางการของ ${coinName}`,
      stayUpdated: 'ติดตามข่าวสารล่าสุดผ่าน',
      visit: 'เยี่ยมชม'
    }
  };

  const texts = anchorTexts[language] || anchorTexts['English'];

  return `
PROMOTIONAL SECTION FOR ${coinName} - THIS MUST BE THE VERY LAST SECTION OF THE ARTICLE!

PLACEMENT RULE (CRITICAL):
- First write ALL ${language} main content sections about the news topic
- ONLY AFTER all main content, add this promotional section as the FINAL section
- This section should be the LAST item in the "sections" array

Section Structure:

Part 1 (Informative Transition + Insight):
Write H2 about ${coinName} following the trending of market and original article.
Start with a brief reference to the article's topic (1 short sentence) to make it flow naturally.
Then add 1-5 sentences of helpful or interesting insight about ${coinName} — such as its latest update, market relevance, or ecosystem growth.
Tone: factual, educational, and consistent with the article — not overly promotional.

CRITICAL RULES:
1. NEUTRAL THIRD-PARTY perspective. NEVER use "our", "we", "us" when referring to the coin.
2. NEVER TRANSLATE "${coinName}" - keep it exactly as "${coinName}".
3. Write this section in ${language} language!
4. Do NOT include any Link Definitions in this promotional section!

Part 2 (Informative CTA – MUST follow this exact structure):
Write this section in ${language} following this EXACT format:

Paragraph 1: "If you're considering ${coinName}, read [${texts.priceAnalysis}](${links.priceAnalysis}) and be sure to check out [${texts.buyingGuide}](${links.buyingGuide}) to build confidence and plan more accurately."

Paragraph 2: "${texts.stayUpdated} [${texts.officialSite}](${links.officialSite})${links.twitter ? `, [X (Twitter)](${links.twitter})` : ""}${links.telegram ? `, and [Telegram](${links.telegram})` : ""}."

Paragraph 3: "${texts.visit} [${texts.officialSite}](${links.officialSite})"

Use Markdown format for links: [anchor text](URL)
`;
};

// Keep for backwards compatibility but not used
const PROMO_TEMPLATE_FULL = ``;

// PROMO_TEMPLATE_CTA will be generated dynamically with actual links
const getPromoTemplateCta = (coinName: string, language: string) => {
  const links = COIN_LINKS[coinName];
  if (!links) return "";

  // Language-specific CTA texts
  const ctaTexts: Record<string, { visit: string; officialSite: string }> = {
    'English': { visit: 'Visit', officialSite: `the ${coinName} official website` },
    'Turkish': { visit: 'Ziyaret edin:', officialSite: `${coinName} resmi web sitesi` },
    'German': { visit: 'Besuchen Sie', officialSite: `die offizielle ${coinName} Website` },
    'French': { visit: 'Visitez', officialSite: `le site officiel de ${coinName}` },
    'Spanish': { visit: 'Visita', officialSite: `el sitio web oficial de ${coinName}` },
    'Italian': { visit: 'Visita', officialSite: `il sito ufficiale di ${coinName}` },
    'Japanese': { visit: '公式サイトを訪問:', officialSite: `${coinName}公式サイト` },
    'Thai': { visit: 'เยี่ยมชม', officialSite: `เว็บไซต์อย่างเป็นทางการของ ${coinName}` }
  };

  const texts = ctaTexts[language] || ctaTexts['English'];

  return `
PROMOTIONAL SECTION FOR ${coinName} - THIS MUST BE THE VERY LAST SECTION OF THE ARTICLE!

PLACEMENT RULE (CRITICAL):
- First write ALL main content sections about the news topic
- ONLY AFTER all main content, add this promotional section as the FINAL section

Section Structure:

Part 1 (Informative Transition + Insight):
Write H2 about ${coinName} following the trending of market and original article.
Start with a brief reference to the article's topic (1 short sentence) to make it flow naturally.
Then add 1-5 sentences of helpful or interesting insight about ${coinName} — such as its latest update, market relevance, or ecosystem growth.
Tone: factual, educational, and consistent with the article — not overly promotional.

CRITICAL RULES:
1. NEVER use "our", "we", "us" when referring to the coin.
2. NEVER TRANSLATE "${coinName}" - keep it exactly as "${coinName}".
3. Write this section in ${language} language!
4. Do NOT include any Link Definitions in this promotional section!

Part 2 (Informative CTA – MUST follow this exact structure):
Write this section in ${language} following this EXACT format:

"${texts.visit} [${texts.officialSite}](${links.officialSite})"

Use Markdown format for links: [anchor text](URL)
`;
};

// Keep for backwards compatibility but not used
const PROMO_TEMPLATE_CTA = ``;

export const generateArticle = async (
  scrapedContent: string[],
  state: AppState
): Promise<GeneratedArticle> => {
  
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.");
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true // Sadece geliştirme için
  });

  const promoCoinName = state.promoCoin || "None";

  // Select logic based on Promo Mode - use dynamic templates with actual links
  let promoInstruction = "";
  if (state.promoMode === 'Full') {
    promoInstruction = getPromoTemplateFull(promoCoinName, state.selectedLanguage);
  } else if (state.promoMode === 'CTA Only') {
    promoInstruction = getPromoTemplateCta(promoCoinName, state.selectedLanguage);
  }
  // If 'No CTA', promoInstruction remains empty
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

    CRITICAL TONE RULES (ABSOLUTE REQUIREMENTS):
    1. **NO SELF-REFERENCE**: NEVER use "us", "we", "our", "ourselves", or "I" anywhere in the article. Write from a neutral third-party journalist perspective. The focus is entirely on the reader and the market.
    2. **NO QUESTIONS**: NEVER ask questions (rhetorical or otherwise). Do not ask "What does this mean for Bitcoin?". Instead, state "This signal indicates a shift for Bitcoin."
    3. **NO ANSWERS OR WARNINGS**: Do NOT provide direct answers, warnings, or advice. Simply report the facts and let the reader draw their own conclusions. Avoid phrases like "you should", "be careful", "watch out", "this means".
    4. **NEUTRAL REPORTING**: Write as an unbiased journalist. Never sound like you're affiliated with any project or coin mentioned. Always maintain professional distance.

    PARAGRAPH LENGTH RULES (VERY IMPORTANT):
    - Each paragraph MUST be EXACTLY 3 sentences - no more, no less.
    - Each sentence should be medium length (15-25 words).
    - Paragraphs should be informative but not overwhelming.
    - Keep paragraphs to approximately 3 lines of text when displayed.

    LINK RULES (CRITICAL - MUST FOLLOW):

    RULE 1: ONLY USE LINKS PROVIDED BY THE USER
    - Do NOT take or reuse any links from the original source text
    - ONLY use links that the user explicitly provides in "Link Definitions"
    - If no links are provided, do NOT add any links to the article

    RULE 2: LINK DEFINITIONS - MAIN ARTICLE CONTENT ONLY
    - Insert links ONLY on the anchor text provided by the user
    - Links from "Link Definitions" must NOT appear inside the Promotional Section
    - These links go in the MAIN article sections, NOT in the promo section

    RULE 3: PROMOTIONAL SECTION LINKS
    - In the Promotional Section, ONLY use:
      * Official website link (provided in the promo template)
      * Official X (Twitter) account link (provided in the promo template)
    - Do NOT put Link Definitions inside the Promotional Section

    LINK PLACEMENT STRATEGY:
    1. Read the anchor text - it tells you the TOPIC of the link
    2. Find a sentence in your MAIN article content that discusses that topic
    3. Embed the link INSIDE that sentence naturally
    4. The link must be CONTEXTUALLY RELEVANT

    FORMAT REQUIREMENTS:
    - Use Markdown format: [Anchor Text](URL)
    - Anchor text must match EXACTLY what the user provided
    - URL must be copied EXACTLY as provided

    PLACEMENT RULES (VERY STRICT):
    - NEVER write links on a separate line by themselves
    - NEVER use "için buraya tıklayın:", "Read more:", "See also:", "Click here:" before/after links
    - NEVER create a standalone sentence just for the link
    - ALWAYS embed links INSIDE an informative sentence
    - The sentence must make sense WITH or WITHOUT the link

    CORRECT LINK PLACEMENT:
    ✅ "Güncel [Bitcoin fiyat analizi](url) verileri yükseliş trendini doğruluyor."
    ✅ "Kurumsal yatırımcıların [kripto piyasası](url) üzerindeki etkisi artıyor."

    WRONG LINK PLACEMENT (NEVER DO THIS):
    ❌ "Daha fazla bilgi için: [Bitcoin fiyat analizi](url)"
    ❌ "[Bitcoin fiyat analizi](url) için tıklayın."
    ❌ A paragraph with ONLY the link and nothing else

    LANGUAGE RULES (CRITICAL - ABSOLUTE REQUIREMENTS):

    STRICT LANGUAGE CONSISTENCY:
    - The ENTIRE article must be written in ONE language only - the TARGET LANGUAGE
    - Do NOT mix languages. If writing in Turkish, every word must be Turkish (except proper nouns)
    - Do NOT use English words/phrases when writing in other languages
    - Do NOT translate common crypto terms incorrectly - use the accepted term in that language

    PROPER NOUNS - NEVER TRANSLATE (CRITICAL):
    These must ALWAYS remain in their ORIGINAL form, regardless of target language:
    - Project/Coin names: "Best Wallet", "Solana", "Ethereum", "Bitcoin", "Cardano", "Shiba Inu"
    - Company names: "BlackRock", "Fidelity", "Binance", "Coinbase", "MicroStrategy"
    - Person names: "Elon Musk", "Vitalik Buterin", "Michael Saylor"
    - Token symbols: BTC, ETH, SOL, XRP, DOGE
    - Technical terms that are universally used: "blockchain", "DeFi", "NFT", "staking", "airdrop"

    WRONG EXAMPLES (NEVER DO THIS):
    ❌ "Best Wallet" → "En İyi Cüzdan" (Turkish) - WRONG! Keep as "Best Wallet"
    ❌ "Best Wallet" → "Лучший кошелек" (Russian) - WRONG! Keep as "Best Wallet"
    ❌ "Shiba Inu" → "Shiba Köpeği" (Turkish) - WRONG! Keep as "Shiba Inu"
    ❌ "MicroStrategy" → "MikroStrateji" - WRONG! Keep as "MicroStrategy"
    ❌ Mixing: "Bitcoin fiyatı surged today" - WRONG! Don't mix languages

    CORRECT EXAMPLES:
    ✅ Turkish: "Best Wallet, son güncellemesiyle dikkat çekiyor."
    ✅ Turkish: "Shiba Inu fiyatı yükselişe geçti."
    ✅ German: "Best Wallet hat ein neues Update veröffentlicht."
    ✅ Spanish: "Best Wallet anuncia nuevas características."

    META DATA LANGUAGE RULES:
    - English: meta title, meta description, slug → English
    - Japanese: meta title & meta description → Japanese, slug → English
    - Thai: meta title & meta description → Thai, slug → English
    - French: meta title, meta description, slug → French
    - German: meta title, meta description, slug → German
    - Turkish: meta title, meta description, slug → Turkish
    - Spanish: meta title, meta description, slug → Spanish
    - Italian: meta title, meta description, slug → Italian

    VALIDATION BEFORE OUTPUT:
    1. Is the entire article in the target language?
    2. Are all proper nouns (project names, company names, person names) kept in original form?
    3. Is there any language mixing? If yes, fix it.

    SEO CONSTRAINTS (CRITICAL - COUNT CHARACTERS CAREFULLY):

    META TITLE (ABSOLUTE REQUIREMENT - STRICTLY ENFORCE):
    - MUST be EXACTLY between 50 and 60 characters (including spaces)
    - Count EVERY character: letters, spaces, punctuation, numbers
    - If your title is less than 50 chars, ADD more words until it reaches 50+
    - If your title is more than 60 chars, REMOVE words until it's under 60
    - REJECTION: Any meta title under 50 or over 60 characters is INVALID
    - BEFORE OUTPUTTING: Count the characters. If not 50-60, REWRITE IT.

    META DESCRIPTION (ABSOLUTE REQUIREMENT - STRICTLY ENFORCE):
    - MUST be EXACTLY between 150 and 160 characters (including spaces)
    - Count EVERY character: letters, spaces, punctuation, numbers
    - If your description is less than 150 chars, ADD more descriptive words
    - If your description is more than 160 chars, TRIM unnecessary words
    - REJECTION: Any meta description under 150 or over 160 characters is INVALID
    - BEFORE OUTPUTTING: Count the characters. If not 150-160, REWRITE IT.

    EXAMPLE Meta Titles (50-60 chars - count them!):
    ✅ "Bitcoin Surges Past $100K as ETF Inflows Hit Record High" (56 chars)
    ✅ "Ethereum Price Analysis: Bulls Target $4,000 Resistance" (55 chars)
    ✅ "XRP Jumps 15% After Ripple Wins Key Legal Battle in Court" (57 chars)
    ❌ "Bitcoin Hits $100K" (18 chars) - TOO SHORT! Add more words!
    ❌ "BTC Price Up" (12 chars) - TOO SHORT! Expand the title!
    ✅ "XRP Price Rallies 15% After Ripple's Legal Victory" (50 chars)

    EXAMPLE Meta Descriptions (150-160 chars):
    ✅ "Bitcoin surged past $100K as institutional investors poured billions into spot ETFs. Market analysts predict further gains ahead of the upcoming halving event." (160 chars)
    ✅ "XRP price jumped 15% following Ripple's major legal victory against the SEC. The token now targets $2 resistance level as trading volume hits monthly highs." (157 chars)

    ❌ TOO SHORT: "Bitcoin price rose today." (25 chars) - WRONG!
    ❌ TOO SHORT: "XRP surged after court ruling. Analysts bullish." (48 chars) - WRONG!

    IMAGE PROMPT GUIDELINES:
    The 'imagePrompt' field should be a medium-length (30-50 words), professional text-to-image prompt that represents the news story.

    MUST INCLUDE:
    1. **News-Specific Elements**: Mention the main cryptocurrency or event from the article
    2. **Mood/Sentiment**: Bullish (green, upward), bearish (red, downward), or neutral
    3. **Visual Style**: Professional, cinematic, clean composition

    EXAMPLE for Bitcoin ETF news:
    "Golden Bitcoin coin with ETF APPROVED text, green candlestick charts rising in background, professional financial setting, cinematic lighting, dark blue and gold color scheme"

    EXAMPLE for whale transaction news:
    "Stylized crypto whale made of digital particles carrying Bitcoin coins, blockchain data streams, blue and purple neon lighting, underwater financial visualization"

    LINK DEFINITIONS (HIGHEST PRIORITY - MANDATORY):
    The user provides internal links that MUST be embedded in the article.

    HOW TO PROCESS EACH LINK:
    1. Parse the anchor text (the clickable text)
    2. Parse the URL (the destination)
    3. Understand what TOPIC the anchor text refers to
    4. Find a paragraph in your MAIN article content that discusses this topic
    5. Write a sentence about that topic and embed the link naturally

    RULES:
    - You MUST use ALL provided links - do not skip any
    - Copy anchor text and URL EXACTLY as provided
    - Each link appears ONCE (no duplicates)
    - Distribute links across different sections
    - Link MUST be in a sentence that discusses the same topic as the anchor

    LINK OUTPUT FORMAT:
    - Format: [Anchor Text](URL)
    - No space between ] and (
    - URL must be complete with https:// or http://

    STEP-BY-STEP EXAMPLE:
    User provides: "Anchor: Bitcoin fiyat analizi Link: https://site.com/btc-price"

    Step 1: Anchor = "Bitcoin fiyat analizi" (topic: Bitcoin price analysis)
    Step 2: URL = "https://site.com/btc-price"
    Step 3: Find/write a sentence about Bitcoin price in your article
    Step 4: Embed: "Güncel [Bitcoin fiyat analizi](https://site.com/btc-price) verileri yükseliş trendini doğruluyor."

    MORE EXAMPLES BY TOPIC:
    - Anchor "XRP haberleri" → "Son [XRP haberleri](url) piyasada heyecan yarattı."
    - Anchor "Ethereum satın alma" → "Yatırımcılar için [Ethereum satın alma](url) rehberi detaylı bilgi sunuyor."
    - Anchor "kripto borsaları" → "Lider [kripto borsaları](url) bu gelişmeye hızlı tepki verdi."

    OUTPUT FORMAT:
    You must output strictly valid JSON. Do not include markdown code blocks like ```json. Just the raw JSON string.

    JSON SCHEMA:
    {
      "title": "Main Article Title",
      "content": {
        "intro": "Introduction with exactly 3 sentences...",
        "sections": [
           {
             "heading": "Section Heading",
             "paragraphs": ["Paragraph with exactly 3 sentences", "Another paragraph with exactly 3 sentences"]
           },
           ... produce exactly ${state.numSections} main sections ...
           // IF promotional content is required, add it as the LAST section in this array
           // The promotional section is INSIDE "sections" array, NOT a separate key
           {
             "heading": "Promotional Coin Section Heading",
             "paragraphs": ["Promo paragraph with official website and X links only"]
           }
        ]
      },
      "seo": {
        "slug": "url-friendly-slug",
        "metaTitle": "SEO Title (50-60 chars)",
        "metaDescription": "SEO Description (150-160 chars)",
        "excerpt": "Short excerpt",
        "imagePrompt": "Medium-length AI image prompt (30-50 words)",
        "altText": "Alt text for the image"
      },
      "sources": [
        { "domain": "domain.com", "url": "full url" }
      ]
    }

    IMPORTANT: Do NOT create a separate "promotional" key. The promotional section must be the last item inside "content.sections" array.
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

    ${includePromo ? `IMPORTANT SECTION ORDER:
    1. First, write ALL ${state.numSections} main content sections about the news topic
    2. The promotional section about ${promoCoinName} MUST be the VERY LAST section (after all main content)
    3. Do NOT put the promotional section at the beginning or middle - it MUST be at the END
    4. CRITICAL: Do NOT include Link Definitions inside the promotional section - only official website and X links allowed there` : ""}
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" }
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error("No response from OpenAI");
    }

    try {
      const parsed = JSON.parse(responseText) as GeneratedArticle;

      // Validate required fields
      if (!parsed.title || !parsed.content || !parsed.seo) {
        throw new Error("Invalid article structure: missing required fields");
      }

      // Validate SEO constraints
      if (parsed.seo.metaTitle.length < 50 || parsed.seo.metaTitle.length > 60) {
        throw new Error(`Invalid meta title length: ${parsed.seo.metaTitle.length} (must be 50-60)`);
      }

      if (parsed.seo.metaDescription.length < 150 || parsed.seo.metaDescription.length > 160) {
        throw new Error(`Invalid meta description length: ${parsed.seo.metaDescription.length} (must be 150-160)`);
      }

      return parsed;
    } catch (parseError: any) {
      console.error("JSON Parse Error:", parseError.message);
      console.error("Raw response:", responseText.substring(0, 500));
      throw new Error(`Failed to parse article: ${parseError.message}. The AI response was not valid JSON.`);
    }

  } catch (error: any) {
    console.error("OpenAI Error:", error.message);
    throw new Error(`OpenAI request failed: ${error.message}`);
  }
};
