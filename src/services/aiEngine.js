// AI Processing & Generation Engine for NewsPilot AI

// Rich curated stock photos matched to specific news topics
const TOPIC_PHOTO_DATABASE = {
  'EV_AUTOMOTIVE': [
    'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1200&auto=format&fit=crop'
  ],
  'AI_TECHNOLOGY': [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1200&auto=format&fit=crop'
  ],
  'SOLAR_CLEANTECH': [
    'https://images.unsplash.com/photo-1509391365360-2e959784a276?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=1200&auto=format&fit=crop'
  ],
  'SPACE_AEROSPACE': [
    'https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop'
  ],
  'FINTECH_BANKING': [
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop'
  ],
  'VENTURE_CAPITAL': [
    'https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop'
  ],
  'GENERAL_BUSINESS': [
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop'
  ]
};

// Extract main numbers, stats, and company words for yellow box highlighting
function extractMainHighlightWords(headlineText) {
  const highlights = [];

  // Match numbers, stats, currency ($50M, 25,000, 3.8 Billion, 35%, 100+ Projects)
  const statsMatches = headlineText.match(/(\$\d+[\d,.]*\s*(million|billion|M|B|k)?|\d+[\d,.]*\s*(NEVs|EVs|Megawatts|MW|Billion|Million|Crore|Lakh|Projects|Percent|%|Speed|x|Years|Valuation)?|\b\d+[\d,.]*\b)/gi);
  if (statsMatches) {
    statsMatches.forEach(m => highlights.push(m.trim()));
  }

  // Match key company names
  const entityMatches = headlineText.match(/\b(BYD|NVIDIA|SpaceX|Google|PayMax|MindMesh|Ikotek|Sequoia|Starship|Gemini|PayFlow)\b/gi);
  if (entityMatches) {
    entityMatches.forEach(m => highlights.push(m.trim()));
  }

  return Array.from(new Set(highlights)).join(', ');
}

// Generates a detailed 8K Midjourney / Imagen 3 Prompt
export function generateImagePrompt(headline, category, company) {
  return `Editorial 3D magazine cover shot illustrating ${headline}. High-tech cinematic studio setup, subtle volumetric fog, 85mm portrait lens f/1.4, dramatic rim lighting in deep emerald green and metallic gold tones. Sleek minimalist aesthetic for ${company} in ${category}. Photorealistic, ultra-detailed, 8K resolution, zero text inside image, no watermarks, professional business journal quality.`;
}

// Detect specific photo database key based on article keywords
function detectImageTopicKey(text) {
  const lower = text.toLowerCase();
  if (/byd|ev|electric vehicle|car|automobile|assembly plant|transport|vehicle|nev/i.test(lower)) {
    return 'EV_AUTOMOTIVE';
  }
  if (/solar|sun|megawatt|clean energy|wind|power capacity|renewable/i.test(lower)) {
    return 'SOLAR_CLEANTECH';
  }
  if (/ai|artificial intelligence|gemini|gpt|robot|neural|machine learning|chip|processor/i.test(lower)) {
    return 'AI_TECHNOLOGY';
  }
  if (/space|rocket|spacex|starship|satellite|orbit|astronaut/i.test(lower)) {
    return 'SPACE_AEROSPACE';
  }
  if (/fintech|bank|pay|crypto|wallet|transaction|dollar|billion|million|export|finance/i.test(lower)) {
    return 'FINTECH_BANKING';
  }
  if (/raise|funding|series|vc|investor|venture|seed/i.test(lower)) {
    return 'VENTURE_CAPITAL';
  }
  return 'GENERAL_BUSINESS';
}

// Simulates or calls Gemini API for analysis
export async function analyzeNewsArticle(inputText, options = {}) {
  const { apiKey, language = 'English', tone = 'Startup Style' } = options;

  // Step 1: Detect Topic and Select Realistic Matching Picture First
  const imageTopicKey = detectImageTopicKey(inputText);
  const topicPhotos = TOPIC_PHOTO_DATABASE[imageTopicKey] || TOPIC_PHOTO_DATABASE['GENERAL_BUSINESS'];
  const selectedImageUrl = topicPhotos[Math.floor(Math.random() * topicPhotos.length)];

  // If Gemini API Key is provided, attempt live fetch
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Analyze the ENTIRE news article and return a JSON object with:
              - headline: punchy, high-impact 8-12 word news headline capturing the MAIN news hook
              - summary: 2-sentence summary
              - category: 1-2 words uppercase (e.g. EV & MOBILITY, AI & TECH, VENTURE CAPITAL, SOLAR ENERGY, FINTECH)
              - company: company name or subject entity
              - country: country name with flag emoji
              - keyNumber: prominent number or stat mentioned
              - date: current formatted date
              - captions: object with instagram, linkedin, twitter, facebook captions including hashtags

              Full Article Input: "${inputText.slice(0, 3500)}"`
            }]
          }]
        })
      });

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const highlightWords = extractMainHighlightWords(parsed.headline);
          return {
            ...parsed,
            highlightWords,
            imageUrl: selectedImageUrl,
            imagePrompt: generateImagePrompt(parsed.headline, parsed.category || 'NEWS', parsed.company || 'Tech Enterprise')
          };
        }
      }
    } catch (e) {
      console.warn("Gemini API call error, using smart local parser fallback:", e);
    }
  }

  // Smart local parser fallback (Full-Text NLP Analysis)
  return parseNewsLocally(inputText, language, tone, selectedImageUrl);
}

// Full-Text NLP Smart Extractor
function parseNewsLocally(inputText, language, tone, selectedImageUrl) {
  const text = inputText.trim();
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // 1. Detect Category & Topic Key
  const topicKey = detectImageTopicKey(text);
  let category = 'AI & TECH';
  if (topicKey === 'EV_AUTOMOTIVE') category = 'EV & MOBILITY';
  else if (topicKey === 'SOLAR_CLEANTECH') category = 'SOLAR & GREEN';
  else if (topicKey === 'SPACE_AEROSPACE') category = 'SPACE TECH';
  else if (topicKey === 'FINTECH_BANKING') category = 'FINTECH';
  else if (topicKey === 'VENTURE_CAPITAL') category = 'VENTURE CAPITAL';

  // 2. Detect Key Stats / Numbers across full text
  const numberMatch = text.match(/(\$\d+(\.\d+)?\s*(million|M|billion|B|k)?|[0-9,]+\s*(NEVs|EVs|Megawatts|MW|Billion|Million|Crore|Lakh|Users|Percent|%|Speed|x))/i);
  const keyNumber = numberMatch ? numberMatch[0].toUpperCase() : 'BREAKING NEWS';

  // 3. Detect Company / Subject Entity
  const companyMatch = text.match(/(BYD|NVIDIA|SpaceX|Google|PayMax|MindMesh|Sequoia|Pakistan|Karachi|Lahore|Islamabad|[A-Z][a-z0-9]+(?:\s+[A-Z][a-z0-9]+)?)/);
  const company = companyMatch ? companyMatch[0] : 'Tech Enterprise';

  // 4. Detect Country / Region
  let country = 'Pakistan 🇵🇰';
  if (/karachi|lahore|islamabad|pakistan/i.test(text)) country = 'Pakistan 🇵🇰';
  else if (/us|usa|america|silicon valley/i.test(text)) country = 'USA 🇺🇸';
  else if (/saudi|uae|dubai|gcc/i.test(text)) country = 'Middle East 🇸🇦';

  // 5. Intelligent Full-Text Headline Extraction (High Impact Summarizer)
  let headline = '';
  if (text.length <= 110) {
    headline = text;
  } else {
    const sentences = text.split(/(?<=[.!?])\s+/);
    const keySentence = sentences.find(s => /\d+|\$|BYD|NVIDIA|SpaceX|Google|launch|raise|install|touch|unveil/i.test(s)) || sentences[0];
    
    if (keySentence.length <= 115) {
      headline = keySentence.trim();
    } else {
      headline = keySentence.substring(0, 110).trim() + '...';
    }
  }

  // 6. Extract Main Words to Highlight in Yellow Boxes
  const highlightWords = extractMainHighlightWords(headline);

  // Language Overrides
  if (language === 'Urdu') {
    headline = text.substring(0, 100);
    country = 'پاکستان 🇵🇰';
  }

  const summary = text.length > 180 ? text.substring(0, 175) + '...' : text;

  return {
    headline,
    summary,
    category,
    company,
    country,
    keyNumber,
    date: dateStr,
    highlightWords,
    imageUrl: selectedImageUrl,
    imagePrompt: generateImagePrompt(headline, category, company),
    captions: generateCaptions(headline, summary, category, company)
  };
}

// Generates customized captions
export function generateCaptions(headline, summary, category, company) {
  const hashtags = `#${category.replace(/\s+/g, '')} #NewsPilot #TechNews #Innovation`;

  return {
    instagram: `🚀 ${headline}\n\n📌 ${summary}\n\n👉 Follow for daily updates!\n\n${hashtags}`,
    linkedin: `📊 Breaking News: ${headline}\n\n${summary}\n\nWhat are your thoughts on this milestone? Share below.\n\n${hashtags}`,
    twitter: `⚡ BREAKING: ${headline}\n\n${summary.substring(0, 120)}...\n\n#TechNews #NewsPilot`,
    facebook: `📰 ${headline}\n\n${summary}\n\nStay tuned for full details.\n\n${hashtags}`
  };
}

// Headline Rewriter
export function rewriteHeadline(currentHeadline, mode) {
  const clean = currentHeadline.replace(/^[⚡🚀💥📰]\s*/, '').trim();

  switch (mode) {
    case 'Make Viral':
      return `🔥 THIS CHANGES EVERYTHING: ${clean}`;
    case 'Make Short':
      return clean.length > 50 ? clean.substring(0, 48) + '...' : clean;
    case 'Make Emotional':
      return `❤️ Historic Milestone: How ${clean} Is Impacting Thousands`;
    case 'Make Formal':
      return `Official Report: ${clean}`;
    case 'Make Startup Style':
    default:
      return `🚀 ${clean}`;
  }
}
