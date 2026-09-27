import React, { useState, useMemo } from 'react';
import {
  Radio,
  RefreshCw,
  Search,
  Filter,
  ArrowUpDown,
  Clock,
  Database,
  ExternalLink,
  ShieldCheck,
  PlaySquare,
  LayoutGrid
} from 'lucide-react';
import { useArticles } from '../hooks/useArticles';
import { CategoryFilter } from '../components/common/CategoryFilter';
import { SearchBar } from '../components/common/SearchBar';
import { StatusBanner } from '../components/common/StatusBanner';
import { ArticleCard } from '../components/cards/ArticleCard';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { InshortsDeck } from '../components/inshorts/InshortsDeck';

interface LiveFeedProps {
  viewMode?: 'deck' | 'grid';
  onToggleViewMode?: () => void;
}

export const LiveFeed: React.FC<LiveFeedProps> = ({
  viewMode = 'deck',
  onToggleViewMode
}) => {
  const {
    articles,
    isLoading,
    isRefreshing,
    error,
    feedSource,
    statusMessage,
    lastUpdated,
    refreshFeed
  } = useArticles();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'readTime' | 'source'>('newest');
  const [activeView, setActiveView] = useState<'deck' | 'cards' | 'stream'>(viewMode === 'deck' ? 'deck' : 'cards');

  React.useEffect(() => {
    if (viewMode === 'deck') setActiveView('deck');
    else if (activeView === 'deck') setActiveView('cards');
  }, [viewMode]);

  // Multi-facet filtering and sorting
  const processedArticles = useMemo(() => {
    let result = articles.filter(article => {
      const matchesCat = !selectedCategory || article.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.description.toLowerCase().includes(q) ||
        article.source.toLowerCase().includes(q) ||
        article.topics.some(t => t.toLowerCase().includes(q));

      return matchesCat && matchesQuery;
    });

    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
      if (sortBy === 'readTime') {
        return (b.readTimeMinutes || 4) - (a.readTimeMinutes || 4);
      }
      if (sortBy === 'source') {
        return a.source.localeCompare(b.source);
      }
      return 0;
    });

    return result;
  }, [articles, selectedCategory, searchQuery, sortBy]);

  const liveArticlesCount = articles.filter(a => a.isLive).length;

  return (
    <div className="min-h-screen pb-20 bg-[#080808]">
      {/* Real-time Status Banner */}
      <StatusBanner
        source={feedSource}
        message={statusMessage}
        lastUpdated={lastUpdated}
        isRefreshing={isRefreshing}
        onRefresh={refreshFeed}
        storyCount={articles.length}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Header with Big Display Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-6 border-b-2 border-neutral-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-code text-red-500 font-bold uppercase tracking-widest mb-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
              <span>CONTINUOUS REAL-TIME WIRE // APIS CONNECTED</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black font-impact tracking-tight text-white leading-none">
              LIVE TECH WIRE
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mt-1.5 font-mono-code uppercase tracking-wider">
              PUBLIC RSS INGESTION: THE VERGE, ARS TECHNICA, TECHCRUNCH, HACKER NEWS
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Pill Switcher */}
            <div className="flex items-center bg-neutral-900 border-2 border-neutral-800 p-1">
              <button
                onClick={() => setActiveView('deck')}
                className={`px-3 py-1.5 text-xs font-mono-code font-bold uppercase cursor-pointer transition-colors ${
                  activeView === 'deck'
                    ? 'bg-red-600 text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Inshorts Deck
              </button>
              <button
                onClick={() => setActiveView('cards')}
                className={`px-3 py-1.5 text-xs font-mono-code font-bold uppercase cursor-pointer transition-colors ${
                  activeView === 'cards'
                    ? 'bg-red-600 text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Cards Grid
              </button>
              <button
                onClick={() => setActiveView('stream')}
                className={`px-3 py-1.5 text-xs font-mono-code font-bold uppercase cursor-pointer transition-colors ${
                  activeView === 'stream'
                    ? 'bg-red-600 text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Stream
              </button>
            </div>

            <button
              onClick={refreshFeed}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-2 bg-neutral-900 border-2 border-neutral-800 hover:border-neutral-600 text-white text-xs font-mono-code font-bold uppercase cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={13} className={isRefreshing ? 'animate-spin text-red-500' : ''} />
              <span>{isRefreshing ? 'SYNCING...' : 'SYNC WIRE'}</span>
            </button>
          </div>
        </div>

        {/* Filter and Control Bar */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="w-full sm:w-96">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Filter real-time dispatches or publishers..."
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end font-mono-code text-xs">
              <div className="flex items-center gap-2 text-neutral-400 bg-neutral-900 border-2 border-neutral-800 px-3 py-1.5">
                <ArrowUpDown size={12} className="text-red-500" />
                <span className="hidden sm:inline">SORT:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="bg-transparent text-white font-bold focus:outline-none cursor-pointer uppercase"
                >
                  <option value="newest" className="bg-black text-white">Newest First</option>
                  <option value="readTime" className="bg-black text-white">Read Time</option>
                  <option value="source" className="bg-black text-white">Publisher</option>
                </select>
              </div>
            </div>
          </div>

          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Feed Status Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-code text-neutral-400 px-4 py-2 bg-neutral-900 border-2 border-neutral-800">
          <div className="flex items-center gap-3">
            <span>DISPATCHES ACTIVE: <strong className="text-white">{processedArticles.length}</strong> / {articles.length}</span>
            {selectedCategory && (
              <span className="text-red-500 font-bold">• {selectedCategory.toUpperCase()}</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-red-500 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
              <span>{liveArticlesCount > 0 ? `${liveArticlesCount} REAL-TIME API STORIES` : 'LOCAL FALLBACK'}</span>
            </span>
          </div>
        </div>

        {/* Content Views */}
        {isLoading ? (
          <LoadingSkeleton type={activeView === 'stream' ? 'row' : 'card'} count={6} />
        ) : error ? (
          <ErrorState message={error} onRetry={refreshFeed} />
        ) : processedArticles.length === 0 ? (
          <EmptyState
            title="No Live Wire Dispatches Matching Criteria"
            description="Adjust your search query or select All Categories to view all real-time dispatches."
            onAction={() => {
              setSearchQuery('');
              setSelectedCategory(null);
            }}
          />
        ) : activeView === 'deck' ? (
          <InshortsDeck articles={processedArticles} />
        ) : activeView === 'stream' ? (
          <div className="space-y-3">
            {processedArticles.map(article => (
              <ArticleCard
                key={article.id}
                article={article}
                variant="horizontal"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedArticles.map(article => (
              <ArticleCard
                key={article.id}
                article={article}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
