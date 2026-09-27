import { useState, useEffect, useCallback } from 'react';
import { Article } from '../types/article';
import { storageService } from '../services/storageService';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Article[]>([]);

  const loadBookmarks = useCallback(() => {
    const list = storageService.getBookmarks();
    setBookmarks(list);
  }, []);

  useEffect(() => {
    loadBookmarks();

    // Listen to storage events for cross-tab or cross-component sync
    const handleStorageChange = () => {
      loadBookmarks();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('bookmarks-updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('bookmarks-updated', handleStorageChange);
    };
  }, [loadBookmarks]);

  const toggleBookmark = useCallback((article: Article) => {
    const isNowBookmarked = storageService.toggleBookmark(article);
    loadBookmarks();
    window.dispatchEvent(new Event('bookmarks-updated'));
    return isNowBookmarked;
  }, [loadBookmarks]);

  const removeBookmark = useCallback((articleId: string) => {
    storageService.removeBookmark(articleId);
    loadBookmarks();
    window.dispatchEvent(new Event('bookmarks-updated'));
  }, [loadBookmarks]);

  const clearAllBookmarks = useCallback(() => {
    storageService.clearAllBookmarks();
    setBookmarks([]);
    window.dispatchEvent(new Event('bookmarks-updated'));
  }, []);

  const isBookmarked = useCallback((articleId: string) => {
    return bookmarks.some(b => b.id === articleId);
  }, [bookmarks]);

  return {
    bookmarks,
    bookmarkCount: bookmarks.length,
    toggleBookmark,
    removeBookmark,
    clearAllBookmarks,
    isBookmarked,
    refreshBookmarks: loadBookmarks
  };
}
