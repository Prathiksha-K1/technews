import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { XMLParser } from 'fast-xml-parser';
import { INITIAL_ARTICLES } from './src/data/initialArticles.ts';
import { Article, TechCategory } from './src/types/article.ts';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '2mb' }));

// Helper to sanitize HTML tags from RSS feeds
function stripHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&hellip;/g, '…')
    .replace(/\s+/g, ' ')
    .trim();
}

// Extract image URL from XML item
function extractImageFromXmlItem(item: any, rawHtmlText: string): string | undefined {
  if (item['media:content'] && item['media:content']['@_url']) {
    return item['media:content']['@_url'];
  }
  if (item['enclosure'] && item['enclosure']['@_url'] && item['enclosure']['@_type']?.startsWith('image')) {
    return item['enclosure']['@_url'];
  }
  if (item['media:thumbnail'] && item['media:thumbnail']['@_url']) {
    return item['media:thumbnail']['@_url'];
  }
  const imgMatch = rawHtmlText.match(/<img[^>]+src=["'](https?:\/\/[^"']+)["']/i);
  if (imgMatch && imgMatch[1]) {
    return imgMatch[1];
  }
  return undefined;
}

// Map keywords to primary tech categories
function detectCategory(text: string): TechCategory {
  const lower = text.toLowerCase();
  if (lower.includes('security') || lower.includes('vulnerability') || lower.includes('cve') || lower.includes('crypto') || lower.includes('hack') || lower.includes('malware') || lower.includes('ransomware') || lower.includes('zero-day')) {
    return 'Cybersecurity';
  }
  if (lower.includes('robot') || lower.includes('humanoid') || lower.includes('autonomous') || lower.includes('actuator') || lower.includes('drone') || lower.includes('quadruped') || lower.includes('bipedal')) {
    return 'Robotics';
  }
  if (lower.includes('semiconductor') || lower.includes('chip') || lower.includes('lithography') || lower.includes('foundry') || lower.includes('transistor') || lower.includes('tsmc') || lower.includes('nvidia') || lower.includes('intel') || lower.includes('qualcomm') || lower.includes('arm')) {
    return 'Semiconductors';
  }
  if (lower.includes('cloud') || lower.includes('kubernetes') || lower.includes('aws') || lower.includes('azure') || lower.includes('serverless') || lower.includes('datacenter') || lower.includes('gcp')) {
    return 'Cloud Computing';
  }
  if (lower.includes('frontend') || lower.includes('web') || lower.includes('css') || lower.includes('javascript') || lower.includes('react') || lower.includes('browser') || lower.includes('html') || lower.includes('next.js') || lower.includes('vite')) {
    return 'Web Development';
  }
  if (lower.includes('compiler') || lower.includes('rust') || lower.includes('kernel') || lower.includes('architecture') || lower.includes('refactor') || lower.includes('database') || lower.includes('sql') || lower.includes('c++') || lower.includes('python')) {
    return 'Software Engineering';
  }
  if (lower.includes('tool') || lower.includes('ide') || lower.includes('debugger') || lower.includes('ci/cd') || lower.includes('git') || lower.includes('package') || lower.includes('github') || lower.includes('docker')) {
    return 'Developer Tools';
  }
  if (lower.includes('startup') || lower.includes('venture') || lower.includes('funding') || lower.includes('valuation') || lower.includes('seed') || lower.includes('series a') || lower.includes('founder') || lower.includes('ipo')) {
    return 'Startups';
  }
  if (lower.includes('research') || lower.includes('quantum') || lower.includes('physics') || lower.includes('paper') || lower.includes('laboratory') || lower.includes('academic') || lower.includes('superconductor')) {
    return 'Technology Research';
  }
  if (lower.includes('machine learning') || lower.includes('deep learning') || lower.includes('diffusion') || lower.includes('neural') || lower.includes('dataset') || lower.includes('reinforcement')) {
    return 'Machine Learning';
  }
  if (lower.includes('ai') || lower.includes('llm') || lower.includes('gpt') || lower.includes('reasoning') || lower.includes('agent') || lower.includes('prompt') || lower.includes('openai') || lower.includes('anthropic') || lower.includes('gemini')) {
    return 'Artificial Intelligence';
  }
  return 'Emerging Technology';
}

const CATEGORY_IMAGES: Record<string, string> = {
  'Artificial Intelligence': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  'Machine Learning': 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80',
  'Cybersecurity': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
  'Robotics': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
  'Cloud Computing': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  'Web Development': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
  'Software Engineering': 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=1200&q=80',
  'Semiconductors': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  'Startups': 'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=1200&q=80',
  'Technology Research': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80',
  'Developer Tools': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
  'Emerging Technology': 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=1200&q=80'
};

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    serverTime: new Date().toISOString(),
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    articleCount: INITIAL_ARTICLES.length
  });
});

// 2. Real-Time Tech Live Wire Endpoint
app.get('/api/feed', async (_req: Request, res: Response) => {
  const liveFeeds = [
    {
      name: 'Ars Technica',
      url: 'https://feeds.arstechnica.com/arstechnica/index',
      type: 'rss'
    },
    {
      name: 'The Verge',
      url: 'https://www.theverge.com/rss/index.xml',
      type: 'rss'
    },
    {
      name: 'TechCrunch',
      url: 'https://techcrunch.com/feed/',
      type: 'rss'
    }
  ];

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_'
  });

  const parsedArticles: Article[] = [];

  // Ingest RSS feeds concurrently
  await Promise.allSettled(
    liveFeeds.map(async feed => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4500);

        const response = await fetch(feed.url, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 TECHSPACE/2.0'
          }
        });
        clearTimeout(timeoutId);

        if (!response.ok) return;

        const xmlText = await response.text();
        const parsed = parser.parse(xmlText);

        // RSS 2.0 or Atom channel items
        const rawItems = parsed?.rss?.channel?.item || parsed?.feed?.entry || [];
        const items = Array.isArray(rawItems) ? rawItems : [rawItems];

        for (let i = 0; i < Math.min(items.length, 8); i++) {
          const item = items[i];
          if (!item) continue;

          const rawTitle = stripHtml(String(item.title || item['title']?.['#text'] || ''));
          const rawContent = String(item['content:encoded'] || item.content || item.description || item.summary || '');
          const cleanDesc = stripHtml(rawContent);
          const link = String(item.link?.['@_href'] || item.link || item.guid || '#');
          const pubDate = item.pubDate || item.published || item.updated;
          const isoDate = pubDate ? new Date(pubDate).toISOString() : new Date().toISOString();

          if (rawTitle.length > 8) {
            const detected = detectCategory(rawTitle + ' ' + cleanDesc);
            const foundImg = extractImageFromXmlItem(item, rawContent);
            const displayImg = foundImg || CATEGORY_IMAGES[detected] || CATEGORY_IMAGES['Emerging Technology'];

            // Build concise 60-word Inshorts summary
            const words = cleanDesc.split(/\s+/);
            const shortExcerpt = words.slice(0, 65).join(' ') + (words.length > 65 ? '...' : '');

            parsedArticles.push({
              id: `live-${feed.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${i}-${Date.now().toString().slice(-4)}`,
              title: rawTitle,
              description: shortExcerpt || `${rawTitle}. Latest technology report from ${feed.name}.`,
              source: feed.name,
              sourceUrl: link,
              publishedAt: isoDate,
              category: detected,
              topics: [detected, feed.name, 'Breaking'],
              imageUrl: displayImg,
              author: String(item['dc:creator'] || item.author?.name || item.author || feed.name),
              readTimeMinutes: Math.max(2, Math.ceil(words.length / 160)),
              aiSummary: shortExcerpt,
              whyItMatters: `This update from ${feed.name} highlights ongoing shifts in ${detected}.`,
              keyPoints: [
                `Published live by ${feed.name}`,
                `Categorized under ${detected}`,
                `Full context and source available via direct publisher link`
              ],
              technologies: [detected],
              entities: [feed.name],
              fullExcerpt: cleanDesc || rawTitle,
              isLive: true
            });
          }
        }
      } catch {
        // Individual feed timeout or error gracefully skipped
      }
    })
  );

  // Fetch top stories from official Hacker News API
  try {
    const hnRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    if (hnRes.ok) {
      const storyIds: number[] = await hnRes.json();
      const topIds = storyIds.slice(0, 6);

      const hnItems = await Promise.allSettled(
        topIds.map(async id => {
          const r = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          return r.ok ? await r.json() : null;
        })
      );

      for (const res of hnItems) {
        if (res.status === 'fulfilled' && res.value && res.value.title) {
          const item = res.value;
          const detected = detectCategory(item.title);
          parsedArticles.push({
            id: `hn-${item.id}`,
            title: item.title,
            description: `Hacker News community trending discussion on ${detected}: ${item.title}. Scored ${item.score || 0} points with ${item.descendants || 0} comments.`,
            source: 'Hacker News Wire',
            sourceUrl: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
            publishedAt: item.time ? new Date(item.time * 1000).toISOString() : new Date().toISOString(),
            category: detected,
            topics: [detected, 'Hacker News', 'Community Trending'],
            imageUrl: CATEGORY_IMAGES[detected] || CATEGORY_IMAGES['Software Engineering'],
            author: item.by || 'HN Community',
            readTimeMinutes: 3,
            aiSummary: `Trending on Hacker News with ${item.score || 0} points: ${item.title}`,
            whyItMatters: `High developer mindshare on ${detected} reflecting current engineering sentiment.`,
            keyPoints: [
              `Direct developer community traction (${item.score || 0} upvotes)`,
              `${item.descendants || 0} active discussion threads on Hacker News`,
              `Categorized as ${detected}`
            ],
            technologies: [detected],
            entities: ['Hacker News Community'],
            fullExcerpt: item.title,
            isLive: true
          });
        }
      }
    }
  } catch {
    // Continue if HN API is busy
  }

  if (parsedArticles.length > 0) {
    // Merge live feeds on top with local verified dataset to keep all 12 categories full
    const seenTitles = new Set<string>();
    const uniqueCombined: Article[] = [];

    // Add live articles first
    for (const art of parsedArticles) {
      const normalizedTitle = art.title.toLowerCase().slice(0, 40);
      if (!seenTitles.has(normalizedTitle)) {
        seenTitles.add(normalizedTitle);
        uniqueCombined.push(art);
      }
    }

    // Append initial verified articles
    for (const art of INITIAL_ARTICLES) {
      const normalizedTitle = art.title.toLowerCase().slice(0, 40);
      if (!seenTitles.has(normalizedTitle)) {
        seenTitles.add(normalizedTitle);
        uniqueCombined.push(art);
      }
    }

    res.json({
      source: 'live',
      message: `LIVE WIRE ACTIVE: Ingested ${parsedArticles.length} real-time world tech dispatches.`,
      fetchedAt: new Date().toISOString(),
      articles: uniqueCombined
    });
  } else {
    // Graceful fallback to verified local dataset with explicit notice
    res.json({
      source: 'fallback',
      message: 'Live feed unavailable — showing cached/demo stories.',
      fetchedAt: new Date().toISOString(),
      articles: INITIAL_ARTICLES
    });
  }
});

// 3. AI Intelligence: Deep Article Analysis with Gemini 3.8 Flash
app.post('/api/intelligence/analyze', async (req: Request, res: Response) => {
  const { title, description, fullExcerpt, category } = req.body;

  if (!title) {
    res.status(400).json({ error: 'Article title is required' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyValid = apiKey && apiKey !== 'MY_GEMINI_API_KEY';

  if (!isKeyValid) {
    const words = (title + ' ' + (description || '')).split(/\s+/);
    const techWords = words.filter(w => w.length > 4 && /^[A-Z]/.test(w)).slice(0, 5);
    res.json({
      summary: description || `${title} demonstrates an impactful development in ${category || 'technology'}.`,
      keyPoints: [
        'Direct development reported across primary technology documentation.',
        `Evaluated under ${category || 'Emerging Technology'} engineering scope.`,
        'Demonstrates measurable efficiency or security implications for software teams.',
        'Architecture requires proactive review prior to production adoption.'
      ],
      whyItMatters: `This advancement influences how engineering organizations evaluate ${category || 'modern technology'} systems, balancing developer throughput against reliability and operating constraints.`,
      technologies: techWords.length > 0 ? techWords : [category || 'Systems', 'Computing'],
      entities: ['Industry Working Group', 'Research Laboratory'],
      industryRelevance: 'High near-term architectural relevance for enterprise engineering and technology leaders.',
      isAiGenerated: false,
      generatedAt: new Date().toISOString(),
      modelUsed: 'Heuristic Analytical Engine (Local Fallback)'
    });
    return;
  }

  try {
    const ai = new GoogleGenAI();
    const prompt = `You are the lead intelligence analyst at TECHSPACE, a real-time technology intelligence portal.
Analyze the following technology news item strictly based on the provided text excerpt. Do not invent ungrounded facts.

Title: "${title}"
Category: "${category || 'Technology'}"
Excerpt: "${fullExcerpt || description || ''}"

Provide a structured JSON output with these exact keys:
{
  "summary": "A concise, objective 2-sentence executive summary explaining what happened.",
  "keyPoints": ["Bullet 1 with concrete technical detail", "Bullet 2 with performance or architectural metric", "Bullet 3 with security or ecosystem impact", "Bullet 4 with deployment timeline or scope"],
  "whyItMatters": "An analytical paragraph explaining the strategic and systemic importance for engineers, researchers, and tech leaders.",
  "technologies": ["Array of up to 5 specific technologies, protocols, or frameworks mentioned"],
  "entities": ["Array of up to 4 organizations, companies, or research institutions mentioned"],
  "industryRelevance": "A 1-sentence assessment of near-term industry adoption and enterprise relevance."
}

Return ONLY valid JSON without markdown fences.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);

    res.json({
      ...parsed,
      isAiGenerated: true,
      generatedAt: new Date().toISOString(),
      modelUsed: 'gemini-3.8-flash'
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      error: 'Failed to generate AI intelligence',
      details: errorMsg
    });
  }
});

// 4. AI Intelligence: Synthesize Macro Technology Trends
app.post('/api/intelligence/synthesize-trends', async (req: Request, res: Response) => {
  const { articles } = req.body;
  const sample = Array.isArray(articles) ? articles.slice(0, 10) : INITIAL_ARTICLES.slice(0, 10);
  const titles = sample.map((a: Article) => `- [${a.category}] ${a.title}`).join('\n');

  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyValid = apiKey && apiKey !== 'MY_GEMINI_API_KEY';

  if (!isKeyValid) {
    res.json({
      trendSummary: 'Across current technology intelligence reports, foundational compute acceleration, hardware-software co-design, and zero-trust memory safety dominate enterprise engineering priorities.',
      emergingThemes: [
        { theme: 'Memory-Safe Systems Migration', impact: 'Accelerated adoption of Rust in kernel and high-throughput systems.' },
        { theme: 'Hardware-Aware AI Scheduling', impact: 'Moving past raw compute to optimize memory bandwidth and silicon photonics.' },
        { theme: 'Local-First Data Architectures', impact: 'Edge databases and WasmGC shifting computation closer to the end user.' }
      ],
      modelUsed: 'Heuristic Analytical Engine (Local Fallback)'
    });
    return;
  }

  try {
    const ai = new GoogleGenAI();
    const prompt = `You are a technology strategist. Given this list of current technology stories:
${titles}

Synthesize 3 emerging macro technology themes connecting these stories.
Return a valid JSON object:
{
  "trendSummary": "A concise 2-sentence macro analysis connecting the recurring developments.",
  "emergingThemes": [
    { "theme": "Theme title", "impact": "Strategic impact on software and industry" }
  ]
}
Return ONLY valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({
      ...parsed,
      modelUsed: 'gemini-3.8-flash',
      generatedAt: new Date().toISOString()
    });
  } catch {
    res.json({
      trendSummary: 'Analysis of current articles indicates converging focus on AI inference cost reduction, memory safety, and post-quantum security.',
      emergingThemes: [
        { theme: 'Inference Efficiency Over Raw Scale', impact: 'Algorithms like speculative decoding driving down GPU operational costs.' },
        { theme: 'Cryptographic Agility', impact: 'Post-quantum standards pushing infrastructure teams to modernize TLS stacks.' }
      ],
      modelUsed: 'Heuristic Engine (Local Fallback)'
    });
  }
});

// ----------------------------------------------------
// VITE OR STATIC SERVING
// ----------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TECHSPACE Real-Time News & Intelligence Portal running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
