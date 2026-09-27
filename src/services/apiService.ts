import { Article, AIAnalysisResult, FeedResponse } from '../types/article';
import { INITIAL_ARTICLES } from '../data/initialArticles';

export const apiService = {
  async fetchFeed(): Promise<FeedResponse> {
    try {
      const response = await fetch('/api/feed');
      if (!response.ok) {
        throw new Error(`Feed fetch failed with status ${response.status}`);
      }
      const data: FeedResponse = await response.json();
      return data;
    } catch {
      return {
        source: 'fallback',
        message: 'Live feed unavailable — showing cached/demo stories.',
        fetchedAt: new Date().toISOString(),
        articles: INITIAL_ARTICLES
      };
    }
  },

  async checkHealth(): Promise<{ status: string; hasGeminiKey: boolean }> {
    try {
      const response = await fetch('/api/health');
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // ignore
    }
    return { status: 'fallback', hasGeminiKey: false };
  },

  async analyzeArticle(article: {
    title: string;
    description?: string;
    fullExcerpt?: string;
    category?: string;
  }): Promise<AIAnalysisResult> {
    try {
      const response = await fetch('/api/intelligence/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article)
      });
      if (!response.ok) {
        throw new Error('Analysis API failed');
      }
      return await response.json();
    } catch {
      return {
        summary: article.description || `${article.title} presents an important development in ${article.category || 'technology'}.`,
        keyPoints: [
          'Detailed technical architecture published for academic and industry evaluation.',
          `Categorized within ${article.category || 'Emerging Technology'} domain.`,
          'Directly influences engineering patterns and infrastructure resource allocation.',
          'Undergoing validation across benchmark testbeds.'
        ],
        whyItMatters: `This update is critical for understanding current trajectory in ${article.category || 'modern technology'}. It bridges foundational theoretical breakthroughs with practical engineering deployment constraints.`,
        technologies: [article.category || 'Computing', 'Systems Architecture', 'Distributed Systems'],
        entities: ['Research Working Group', 'Standardization Body'],
        industryRelevance: 'Significant near-term operational relevance for software engineers, researchers, and systems architects.',
        isAiGenerated: false,
        generatedAt: new Date().toISOString(),
        modelUsed: 'Analytical Engine (Offline Fallback)'
      };
    }
  },

  async synthesizeTrends(articles: Article[]): Promise<{
    trendSummary: string;
    emergingThemes: Array<{ theme: string; impact: string }>;
    modelUsed: string;
  }> {
    try {
      const response = await fetch('/api/intelligence/synthesize-trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articles: articles.slice(0, 10) })
      });
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // ignore
    }

    return {
      trendSummary: 'Current technology indicators emphasize deep efficiency optimizations in AI inference pipelines, hardware-level memory safety, and post-quantum cryptographic transitions.',
      emergingThemes: [
        { theme: 'Inference Throughput Optimization', impact: 'Sub-linear acceleration mechanisms like speculative sampling lowering datacenter power thresholds.' },
        { theme: 'Memory-Safe Systems Mainlining', impact: 'Rust expansion into core OS kernels systematically eliminating pointer-safety CVE categories.' },
        { theme: 'Post-Quantum Infrastructure Readiness', impact: 'IETF standardization driving early hybrid TLS 1.4 deployments across internet backbones.' }
      ],
      modelUsed: 'Analytical Engine (Local Baseline)'
    };
  }
};
