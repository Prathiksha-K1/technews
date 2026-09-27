import { useState, useEffect, useCallback, useMemo } from 'react';
import { Article, FeedResponse, TechCategory } from '../types/article';
import { apiService } from '../services/apiService';
import { storageService } from '../services/storageService';
import { INITIAL_ARTICLES } from '../data/initialArticles';

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [feedSource, setFeedSource] = useState<'live' | 'fallback'>('fallback');
  const [statusMessage, setStatusMessage] = useState<string>('Initializing technology intelligence feed...');
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());

  const fetchArticlesData = useCallback(async (isManualRefresh: boolean = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const feedRes: FeedResponse = await apiService.fetchFeed();
      const userSubmissions = storageService.getUserSubmissions();

      // Merge user submissions at the top, then feed articles, avoiding duplicates by id
      const seenIds = new Set<string>();
      const combined: Article[] = [];

      for (const item of [...userSubmissions, ...feedRes.articles]) {
        if (!seenIds.has(item.id)) {
          seenIds.add(item.id);
          combined.push(item);
        }
      }

      setArticles(combined);
      setFeedSource(feedRes.source);
      setStatusMessage(feedRes.message);
      setLastUpdated(feedRes.fetchedAt || new Date().toISOString());
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to retrieve articles feed';
      setError(msg);
      // Gracefully fall back to local dataset with user submissions
      const userSubmissions = storageService.getUserSubmissions();
      setArticles([...userSubmissions, ...INITIAL_ARTICLES]);
      setFeedSource('fallback');
      setStatusMessage('Live feed unavailable — showing cached/demo stories.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchArticlesData();

    // Listen to local user submission events
    const handleSubmissionsUpdated = () => {
      fetchArticlesData(false);
    };
    window.addEventListener('articles-updated', handleSubmissionsUpdated);
    return () => {
      window.removeEventListener('articles-updated', handleSubmissionsUpdated);
    };
  }, [fetchArticlesData]);

  // Dynamic statistics calculated strictly from the available dataset (no fake statistics!)
  const stats = useMemo(() => {
    const totalStories = articles.length;
    const categoryCount = new Set(articles.map(a => a.category)).size;
    const uniqueSources = new Set(articles.map(a => a.source)).size;
    const totalReadMinutes = articles.reduce((sum, a) => sum + (a.readTimeMinutes || 4), 0);
    const liveStoriesCount = articles.filter(a => a.isLive).length;

    return {
      totalStories,
      categoryCount,
      uniqueSources,
      totalReadMinutes,
      liveStoriesCount
    };
  }, [articles]);

  // Dynamic trend computation strictly from dataset
  const computedTrends = useMemo(() => {
    const topicFrequency: Record<string, { count: number; category: TechCategory; articleIds: string[] }> = {};

    articles.forEach(article => {
      article.topics.forEach(t => {
        const normalized = t.trim();
        if (!topicFrequency[normalized]) {
          topicFrequency[normalized] = {
            count: 0,
            category: article.category,
            articleIds: []
          };
        }
        topicFrequency[normalized].count += 1;
        topicFrequency[normalized].articleIds.push(article.id);
      });
    });

    return Object.entries(topicFrequency)
      .map(([topic, data]) => ({
        topic,
        storyCount: data.count,
        category: data.category,
        velocityScore: Math.min(100, Math.round(data.count * 22 + (data.count > 1 ? 25 : 10))),
        description: `Active trend tracked across ${data.count} report${data.count > 1 ? 's' : ''} in ${data.category}.`,
        sampleArticleIds: data.articleIds
      }))
      .sort((a, b) => b.storyCount - a.storyCount || b.velocityScore - a.velocityScore);
  }, [articles]);

  return {
    articles,
    isLoading,
    isRefreshing,
    error,
    feedSource,
    statusMessage,
    lastUpdated,
    stats,
    computedTrends,
    refreshFeed: () => fetchArticlesData(true)
  };
}
