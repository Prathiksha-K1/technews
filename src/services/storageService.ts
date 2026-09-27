import { Article } from '../types/article';

const BOOKMARKS_KEY = 'techpulse_bookmarks_v1';
const RECENTLY_VIEWED_KEY = 'techpulse_recently_viewed_v1';
const USER_SUBMISSIONS_KEY = 'techpulse_user_submissions_v1';

export const storageService = {
  // Bookmark operations
  getBookmarks(): Article[] {
    try {
      const data = localStorage.getItem(BOOKMARKS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  isBookmarked(articleId: string): boolean {
    const list = this.getBookmarks();
    return list.some(a => a.id === articleId);
  },

  toggleBookmark(article: Article): boolean {
    try {
      const current = this.getBookmarks();
      const exists = current.some(a => a.id === article.id);
      let updated: Article[];
      if (exists) {
        updated = current.filter(a => a.id !== article.id);
      } else {
        updated = [article, ...current];
      }
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
      return !exists;
    } catch {
      return false;
    }
  },

  removeBookmark(articleId: string): void {
    try {
      const current = this.getBookmarks();
      const updated = current.filter(a => a.id !== articleId);
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    } catch {
      // storage error handling
    }
  },

  clearAllBookmarks(): void {
    try {
      localStorage.removeItem(BOOKMARKS_KEY);
    } catch {
      // ignore
    }
  },

  // Recently viewed operations
  getRecentlyViewed(): Article[] {
    try {
      const data = localStorage.getItem(RECENTLY_VIEWED_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  recordArticleView(article: Article): void {
    try {
      const current = this.getRecentlyViewed();
      const filtered = current.filter(a => a.id !== article.id);
      const updated = [article, ...filtered].slice(0, 10);
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  },

  // User submitted articles (Form handling & validation demo)
  getUserSubmissions(): Article[] {
    try {
      const data = localStorage.getItem(USER_SUBMISSIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveUserSubmission(article: Article): void {
    try {
      const current = this.getUserSubmissions();
      const updated = [article, ...current];
      localStorage.setItem(USER_SUBMISSIONS_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }
};
