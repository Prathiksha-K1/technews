/**
 * TECHPULSE Data Models & Type Definitions
 * Normalized schemas for articles, AI intelligence, categories, and trends.
 */

export type TechCategory =
  | 'Artificial Intelligence'
  | 'Machine Learning'
  | 'Cybersecurity'
  | 'Robotics'
  | 'Cloud Computing'
  | 'Web Development'
  | 'Software Engineering'
  | 'Semiconductors'
  | 'Startups'
  | 'Technology Research'
  | 'Developer Tools'
  | 'Emerging Technology';

export interface Article {
  id: string;
  title: string;
  description: string;
  source: string;
  sourceUrl: string;
  publishedAt: string; // ISO 8601
  category: TechCategory;
  topics: string[];
  imageUrl?: string;
  author?: string;
  readTimeMinutes?: number;
  aiSummary?: string;
  keyPoints?: string[];
  technologies?: string[];
  entities?: string[];
  whyItMatters?: string;
  fullExcerpt?: string;
  isLive?: boolean;
}

export interface AIAnalysisResult {
  summary: string;
  keyPoints: string[];
  whyItMatters: string;
  technologies: string[];
  entities: string[];
  industryRelevance: string;
  isAiGenerated: boolean;
  generatedAt: string;
  modelUsed?: string;
}

export interface TrendTopic {
  topic: string;
  storyCount: number;
  category: TechCategory;
  velocityScore: number; // 1-100 calculated from recency & count
  description: string;
  sampleArticleIds: string[];
  sampleArticles?: Article[];
}

export interface CategoryMeta {
  name: TechCategory;
  slug: string;
  description: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  iconName: string;
}

export interface UserSubmittedArticle {
  title: string;
  category: TechCategory;
  source: string;
  sourceUrl: string;
  description: string;
  fullExcerpt: string;
  topics: string;
  author: string;
}

export interface FeedResponse {
  source: 'live' | 'fallback';
  message: string;
  fetchedAt: string;
  articles: Article[];
}
