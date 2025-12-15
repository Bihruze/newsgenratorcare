import OpenAI from "openai";
import { AppState, GeneratedArticle } from "../types";
import { COIN_FACTS, COIN_LINKS } from "./coinFacts";

// CTA Template - Always included with full promotional content
const getCtaTemplate = (coinName: string, language: string) => {
  const links = COIN_LINKS[coinName];
  if (!links) return "";

  // Language-specific anchor texts for CTA
  const anchorTexts: Record<string, {
    priceAnalysis: string;
    buyingGuide: string;
    officialSite: string;
    stayUpdated: string;
    visit: string;
    consideringText: string;
    readAndCheck: string;
  }> = {
    'English': {
      priceAnalysis: `${coinName} price analysis`,
      buyingGuide: `step-by-step guide to buying ${coinName}`,
      officialSite: `the ${coinName} official website`,
      stayUpdated: 'Stay updated on the latest news via',
      visit: 'Visit',
      consideringText: `If you're considering ${coinName}`,
      readAndCheck: 'read and be sure to check out'
    },
    'Turkish': {
      priceAnalysis: `${coinName} fiyat analizi`,
      buyingGuide: `${coinName} satın alma rehberi`,
      officialSite: `${coinName} resmi web sitesi`,
      stayUpdated: 'En son haberlerden haberdar olun:',
      visit: 'Ziyaret edin:',
      consideringText: `${coinName} düşünüyorsanız`,
      readAndCheck: 'okuyun ve mutlaka göz atın'
    },
    'German': {
      priceAnalysis: `${coinName} Preisanalyse`,
      buyingGuide: `Schritt-für-Schritt-Anleitung zum Kauf von ${coinName}`,
      officialSite: `die offizielle ${coinName} Website`,
      stayUpdated: 'Bleiben Sie über die neuesten Nachrichten informiert:',
      visit: 'Besuchen Sie',
      consideringText: `Wenn Sie ${coinName} in Betracht ziehen`,
      readAndCheck: 'lesen Sie und schauen Sie sich unbedingt an'
    },
    'French': {
      priceAnalysis: `analyse du prix de ${coinName}`,
      buyingGuide: `guide d'achat de ${coinName}`,
      officialSite: `le site officiel de ${coinName}`,
      stayUpdated: 'Restez informé des dernières nouvelles via',
      visit: 'Visitez',
      consideringText: `Si vous envisagez ${coinName}`,
      readAndCheck: 'lisez et consultez'
    },
    'Spanish': {
      priceAnalysis: `análisis de precio de ${coinName}`,
      buyingGuide: `guía paso a paso para comprar ${coinName}`,
      officialSite: `el sitio web oficial de ${coinName}`,
      stayUpdated: 'Mantente actualizado con las últimas noticias en',
      visit: 'Visita',
      consideringText: `Si estás considerando ${coinName}`,
      readAndCheck: 'lee y asegúrate de revisar'
    },
    'Italian': {
      priceAnalysis: `analisi del prezzo di ${coinName}`,
      buyingGuide: `guida passo-passo per acquistare ${coinName}`,
      officialSite: `il sito ufficiale di ${coinName}`,
      stayUpdated: 'Rimani aggiornato sulle ultime notizie tramite',
      visit: 'Visita',
      consideringText: `Se stai considerando ${coinName}`,
      readAndCheck: 'leggi e assicurati di consultare'
    },
    'Japanese': {
      priceAnalysis: `${coinName}価格分析`,
      buyingGuide: `${coinName}購入ガイド`,
      officialSite: `${coinName}公式サイト`,
      stayUpdated: '最新ニュースをチェック:',
      visit: '公式サイトを訪問:',
      consideringText: `${coinName}を検討している場合`,
      readAndCheck: 'を読んで、必ずチェックしてください'
    },
    'Thai': {
      priceAnalysis: `การวิเคราะห์ราคา ${coinName}`,
      buyingGuide: `คู่มือการซื้อ ${coinName}`,
      officialSite: `เว็บไซต์อย่างเป็นทางการของ ${coinName}`,
      stayUpdated: 'ติดตามข่าวสารล่าสุดผ่าน',
      visit: 'เยี่ยมชม',
      consideringText: `หากคุณกำลังพิจารณา ${coinName}`,
      readAndCheck: 'อ่านและตรวจสอบ'
    }
  };

  const texts = anchorTexts[language] || anchorTexts['English'];

  return `
PROMOTIONAL CTA SECTION FOR ${coinName} - THIS MUST BE THE VERY LAST SECTION OF THE ARTICLE!

PLACEMENT RULE (CRITICAL):
- First write ALL translated main content sections from the source article
- ONLY AFTER all main content, add this promotional section as the FINAL section
- This section should be the LAST item in the "sections" array

Section Structure:

Part 1 (Informative Transition + Insight):
Write H2 about ${coinName} that connects naturally to the article's topic.
Start with a brief reference to the article's topic (1 short sentence) to make it flow naturally.
Then add 2-4 sentences of helpful or interesting insight about ${coinName} — such as its latest update, market relevance, or ecosystem growth.
Tone: factual, educational, and consistent with the article — not overly promotional.

CRITICAL RULES:
1. NEUTRAL THIRD-PARTY perspective. NEVER use "our", "we", "us" when referring to the coin.
2. NEVER TRANSLATE "${coinName}" - keep it exactly as "${coinName}".
3. Write this section in ${language} language!
4. Do NOT include any Link Definitions in this promotional section!

Part 2 (Informative CTA – MUST follow this exact structure):
Write this section in ${language} following this EXACT format:

Paragraph 1: "${texts.consideringText}, ${texts.readAndCheck} [${texts.priceAnalysis}](${links.priceAnalysis}) ve [${texts.buyingGuide}](${links.buyingGuide})."

Paragraph 2: "${texts.stayUpdated} [${texts.officialSite}](${links.officialSite})${links.twitter ? `, [X (Twitter)](${links.twitter})` : ""}${links.telegram ? `, [Telegram](${links.telegram})` : ""}."

Paragraph 3: "${texts.visit} [${texts.officialSite}](${links.officialSite})"

Use Markdown format for links: [anchor text](URL)
`;
};

export const generateArticle = async (
  scrapedContent: string[],
  state: AppState
): Promise<GeneratedArticle> => {

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.");
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  const promoCoinName = state.promoCoin || "None";

  // CTA is ALWAYS included when a coin is selected
  const includePromo = state.promoCoin !== 'None';
  const promoInstruction = includePromo ? getCtaTemplate(promoCoinName, state.selectedLanguage) : "";
  const promoOverride = state.customPromoText ? `\nCustom Promotional Text Override:\n${state.customPromoText}` : "";

  // Retrieve factual data if available
  const coinFacts = COIN_FACTS[promoCoinName] || "";

  const systemInstruction = `
    You are an expert cryptocurrency news TRANSLATOR and content localizer.

    ═══════════════════════════════════════════════════════════════════════════════
    ██  CRITICAL MISSION: COMPLETE TRANSLATION - NOT SUMMARIZATION  ██
    ═══════════════════════════════════════════════════════════════════════════════

    Your PRIMARY task is to FULLY TRANSLATE the source article into the target language.

    🚨 ABSOLUTE REQUIREMENTS:
    1. TRANSLATE EVERYTHING - Every single piece of information must be preserved
    2. NO SUMMARIZATION - Do NOT shorten, skip, or condense ANY content
    3. NO INFORMATION LOSS - All facts, figures, quotes, dates must appear in output
    4. COMPLETE COVERAGE - If source has 10 paragraphs, output must cover ALL 10
    5. ORIGINALITY - Rewrite sentences in your own words (paraphrase), don't copy word-for-word

    ═══════════════════════════════════════════════════════════════════════════════
    ██  TRANSLATION METHODOLOGY  ██
    ═══════════════════════════════════════════════════════════════════════════════

    STEP 1: ANALYZE SOURCE STRUCTURE
    - Count all sections/headings in the source
    - Identify all key information points
    - Note all statistics, numbers, quotes, names

    STEP 2: TRANSLATE COMPLETELY
    - Create equivalent sections for EVERY source section
    - Each source paragraph → translated paragraph (same information)
    - Preserve the logical flow and structure

    STEP 3: VERIFY COMPLETENESS
    - Before output, verify ALL source information is included
    - Check: Are all numbers/statistics present?
    - Check: Are all quotes/statements present?
    - Check: Are all entities (people, companies, projects) mentioned?

    ═══════════════════════════════════════════════════════════════════════════════
    ██  ORIGINALITY & PARAPHRASING RULES  ██
    ═══════════════════════════════════════════════════════════════════════════════

    While translating COMPLETELY, you must also make the content ORIGINAL:

    ✅ DO THIS (Paraphrase):
    - Restructure sentences while keeping the same meaning
    - Use synonyms and alternative expressions
    - Change sentence order within paragraphs
    - Combine or split sentences naturally
    - Add smooth transitions between ideas

    ❌ DON'T DO THIS:
    - Word-for-word direct translation (sounds robotic)
    - Skip information to make it "original"
    - Add information that wasn't in the source
    - Change the meaning or facts

    EXAMPLE:
    Source: "Bitcoin surged 15% yesterday as institutional investors bought heavily."

    ❌ Bad (word-for-word): "Bitcoin dün %15 yükseldi çünkü kurumsal yatırımcılar yoğun şekilde satın aldı."
    ✅ Good (paraphrased): "Kurumsal yatırımcıların yoğun alımları Bitcoin'i dün %15'lik güçlü bir yükselişe taşıdı."

    Both have THE SAME INFORMATION, but the second reads more naturally.

    ═══════════════════════════════════════════════════════════════════════════════
    ██  SECTION COUNT RULES (DYNAMIC)  ██
    ═══════════════════════════════════════════════════════════════════════════════

    The number of sections should MATCH the source content:

    - If source has 5 distinct topics → Create 5 sections
    - If source has 8 distinct topics → Create 8 sections
    - If source has 3 distinct topics → Create 3 sections

    User's "numSections" is just a MINIMUM - you can and SHOULD create MORE sections
    if the source content requires it. NEVER cut content to fit a section limit.

    ═══════════════════════════════════════════════════════════════════════════════
    ██  TONE AND STYLE  ██
    ═══════════════════════════════════════════════════════════════════════════════

    ROLE:
    Write as an authoritative cryptocurrency journalist. Use a casual and personable
    tone with crypto-specific terminology. Keep the style conversational and engaging.
    Address the reader as "you" when appropriate.

    CRITICAL TONE RULES:
    1. **NO SELF-REFERENCE**: NEVER use "us", "we", "our", "ourselves", "I"
    2. **NO QUESTIONS**: NEVER ask rhetorical questions
    3. **NEUTRAL REPORTING**: Write as an unbiased journalist
    4. **FACTUAL**: Report facts without warnings or advice

    ═══════════════════════════════════════════════════════════════════════════════
    ██  PARAGRAPH STRUCTURE  ██
    ═══════════════════════════════════════════════════════════════════════════════

    - Each paragraph: EXACTLY 3 sentences (no more, no less)
    - Each sentence: 15-25 words (medium length)
    - Create as many paragraphs as needed to cover ALL source information

    ═══════════════════════════════════════════════════════════════════════════════
    ██  LANGUAGE RULES  ██
    ═══════════════════════════════════════════════════════════════════════════════

    STRICT LANGUAGE CONSISTENCY:
    - Entire article in ONE language only (target language)
    - NO language mixing

    NEVER TRANSLATE THESE (Keep in original form):
    - Project/Coin names: "Best Wallet", "Solana", "Ethereum", "Bitcoin", "Shiba Inu"
    - Company names: "BlackRock", "Fidelity", "Binance", "Coinbase", "MicroStrategy"
    - Person names: "Elon Musk", "Vitalik Buterin", "Michael Saylor"
    - Token symbols: BTC, ETH, SOL, XRP, DOGE
    - Technical terms: "blockchain", "DeFi", "NFT", "staking", "airdrop"

    ❌ WRONG: "Best Wallet" → "En İyi Cüzdan"
    ✅ CORRECT: "Best Wallet" stays as "Best Wallet"

    META DATA LANGUAGE:
    - English: meta title, description, slug → English
    - Japanese/Thai: meta title & description → Target language, slug → English
    - Other languages: meta title, description, slug → Target language

    ═══════════════════════════════════════════════════════════════════════════════
    ██  LINK RULES  ██
    ═══════════════════════════════════════════════════════════════════════════════

    RULE 1: ONLY use links from "Link Definitions" provided by user
    RULE 2: Link Definitions go in MAIN content only (NOT in promo section)
    RULE 3: Promo section uses ONLY official coin links from template

    LINK PLACEMENT:
    - Embed links INSIDE informative sentences naturally
    - NEVER: "Click here:", "Read more:", standalone link lines
    - ALWAYS: Links within flowing text

    Format: [Anchor Text](URL) - no space between ] and (

    ✅ "Güncel [Bitcoin fiyat analizi](url) verileri yükselişi doğruluyor."
    ❌ "Daha fazla bilgi için: [Bitcoin fiyat analizi](url)"

    ═══════════════════════════════════════════════════════════════════════════════
    ██  SEO REQUIREMENTS  ██
    ═══════════════════════════════════════════════════════════════════════════════

    META TITLE: EXACTLY 50-60 characters (count carefully!)
    META DESCRIPTION: EXACTLY 150-160 characters (count carefully!)

    IMAGE PROMPT: 30-50 words describing a professional crypto news image

    ═══════════════════════════════════════════════════════════════════════════════
    ██  OUTPUT JSON FORMAT  ██
    ═══════════════════════════════════════════════════════════════════════════════

    Output ONLY valid JSON (no markdown code blocks):

    {
      "title": "Translated Article Title",
      "content": {
        "intro": "Introduction paragraph with exactly 3 sentences...",
        "sections": [
          {
            "heading": "Section 1 Heading",
            "paragraphs": ["3-sentence paragraph", "3-sentence paragraph", ...]
          },
          {
            "heading": "Section 2 Heading",
            "paragraphs": ["3-sentence paragraph", ...]
          },
          // ... AS MANY SECTIONS AS NEEDED to cover ALL source content ...
          // LAST SECTION: Promotional CTA (if coin selected)
          {
            "heading": "Promotional Section Heading",
            "paragraphs": ["Promo content with official links"]
          }
        ]
      },
      "seo": {
        "slug": "url-friendly-slug",
        "metaTitle": "50-60 char SEO title",
        "metaDescription": "150-160 char description",
        "excerpt": "Short excerpt",
        "imagePrompt": "30-50 word image prompt",
        "altText": "Image alt text"
      },
      "sources": [
        { "domain": "source-domain.com", "url": "full source url" }
      ]
    }

    ═══════════════════════════════════════════════════════════════════════════════
    ██  FINAL CHECKLIST BEFORE OUTPUT  ██
    ═══════════════════════════════════════════════════════════════════════════════

    □ Did I translate ALL information from the source?
    □ Did I create enough sections to cover everything?
    □ Are all numbers, statistics, quotes preserved?
    □ Is the content original (paraphrased, not copied)?
    □ Is meta title 50-60 chars? (COUNT IT!)
    □ Is meta description 150-160 chars? (COUNT IT!)
    □ Is promotional CTA the LAST section?
    □ Are proper nouns kept in original form?
    □ Is the entire article in the target language (except proper nouns)?
  `;

  const linkContext = state.linkDefinitions
    ? `LINK DEFINITIONS (Embed these in MAIN article content, NOT in promo section):\n${state.linkDefinitions}`
    : "No link definitions provided.";

  const userPrompt = `
    ═══════════════════════════════════════════════════════════════════════════════
    TASK: COMPLETE TRANSLATION of the source article
    ═══════════════════════════════════════════════════════════════════════════════

    TARGET LANGUAGE: ${state.selectedLanguage}

    ═══════════════════════════════════════════════════════════════════════════════
    SOURCE CONTENT TO TRANSLATE (TRANSLATE EVERYTHING - DO NOT SKIP ANYTHING):
    ═══════════════════════════════════════════════════════════════════════════════

    ${scrapedContent.join('\n\n--- NEXT SOURCE ---\n\n')}

    ═══════════════════════════════════════════════════════════════════════════════
    ADDITIONAL PARAMETERS:
    ═══════════════════════════════════════════════════════════════════════════════

    - Keywords to emphasize: ${state.keywords || 'None specified'}
    - News Angle/Focus: ${state.newsAngle || 'Follow source article structure'}
    - Additional Instructions: ${state.additionalContent || 'None'}
    - Minimum Sections: ${state.numSections} (create MORE if source content requires)

    ${linkContext}

    ═══════════════════════════════════════════════════════════════════════════════
    PROMOTIONAL CTA SECTION (ALWAYS INCLUDE AS LAST SECTION):
    ═══════════════════════════════════════════════════════════════════════════════

    ${includePromo ? `
    Promotional Coin: ${promoCoinName}

    FACTUAL DATA FOR ${promoCoinName}:
    ${coinFacts}

    ${promoInstruction}
    ${promoOverride}

    ⚠️ CRITICAL: The promotional CTA section MUST be the VERY LAST section!
    ⚠️ Do NOT put Link Definitions in the promotional section!
    ` : 'No promotional coin selected - skip promotional section'}

    ═══════════════════════════════════════════════════════════════════════════════
    REMINDER: TRANSLATE COMPLETELY - DO NOT SUMMARIZE!
    ═══════════════════════════════════════════════════════════════════════════════

    Your output must contain ALL information from the source article.
    Create as many sections as needed. Do not cut or condense content.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      max_tokens: 16000 // Increased for longer translations
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

      // Validate SEO constraints with more lenient retry logic
      const metaTitleLength = parsed.seo.metaTitle.length;
      const metaDescLength = parsed.seo.metaDescription.length;

      if (metaTitleLength < 45 || metaTitleLength > 65) {
        console.warn(`Meta title length: ${metaTitleLength} (target: 50-60)`);
      }

      if (metaDescLength < 140 || metaDescLength > 170) {
        console.warn(`Meta description length: ${metaDescLength} (target: 150-160)`);
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

export const generateImage = async (prompt: string): Promise<string> => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured.");
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard"
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
      throw new Error("Failed to generate image: No URL returned");
    }

    return imageUrl;
  } catch (error: any) {
    console.error("Image generation error:", error);
    throw new Error(`Image generation failed: ${error.message}`);
  }
};
