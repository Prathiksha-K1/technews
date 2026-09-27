import { useState, useEffect, useCallback } from 'react';
import { Article } from '../types/article';
import { storageService } from '../services/storageService';

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<Article[]>([]);

  const loadRecent = useCallback(() => {
    setRecentlyViewed(storageService.getRecentlyViewed());
  }, []);

  useEffect(() => {
    loadRecent();
  }, [loadRecent]);

  const recordView = useCallback((article: Article) => {
    storageService.recordArticleView(article);
    loadRecent();
  }, [loadRecent]);

  return {
    recentlyViewed,
    recordView,
    refreshRecent: loadRecent
  };
}
