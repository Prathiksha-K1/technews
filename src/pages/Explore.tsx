import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Compass,
  Search,
  Hash,
  History,
  Bookmark,
  Layers,
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';
import { useArticles } from '../hooks/useArticles';
import { useDebounce } from '../hooks/useDebounce';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import { useBookmarks } from '../hooks/useBookmarks';
import { SearchBar } from '../components/common/SearchBar';
import { CategoryFilter } from '../components/common/CategoryFilter';
import { NewsGrid } from '../components/cards/NewsGrid';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ArticleCard } from '../components/cards/ArticleCard';

export const Explore: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { articles, isLoading, computedTrends } = useArticles();
  const { recentlyViewed } = useRecentlyViewed();
  const { bookmarkCount } = useBookmarks();

  const initialCat = searchParams.get('category');
  const initialTopic = searchParams.get('topic');
  const initialQuery = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCat);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(initialTopic);

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Sync state with URL params
  useEffect(() => {
    const params: Record<string, string> = {};
    if (debouncedSearch) params.q = debouncedSearch;
    if (selectedCategory) params.category = selectedCategory;
    if (selectedTopic) params.topic = selectedTopic;
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, selectedCategory, selectedTopic, setSearchParams]);

  // All unique topics extracted from dataset
  const allTopics = useMemo(() => {
    const set = new Set<string>();
    articles.forEach(a => a.topics.forEach(t => set.add(t)));
    return Array.from(set).sort();
  }, [articles]);

  // Filtered results
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesCat = !selectedCategory || article.category === selectedCategory;
      const matchesTopic = !selectedTopic || article.topics.includes(selectedTopic);
      const q = debouncedSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.description.toLowerCase().includes(q) ||
        article.source.toLowerCase().includes(q) ||
        (article.technologies && article.technologies.some(t => t.toLowerCase().includes(q))) ||
        (article.entities && article.entities.some(e => e.toLowerCase().includes(q))) ||
        article.topics.some(t => t.toLowerCase().includes(q));

      return matchesCat && matchesTopic && matchesSearch;
    });
  }, [articles, selectedCategory, selectedTopic, debouncedSearch]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedTopic(null);
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="mb-8 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-400 font-bold uppercase mb-2">
            <Compass size={15} />
            <span>Discovery Radar</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Explore Technology Horizons
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mt-1.5 leading-relaxed">
            Multi-vector search across foundation models, cybersecurity exploits, systems code, and emerging hardware architectures.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="space-y-4 mb-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by keywords, technologies, systems, or entities..."
          />

          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Topic Tag Matrix */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-mono-code text-slate-500 shrink-0 flex items-center gap-1">
              <Hash size={12} /> Topics:
            </span>

            {allTopics.slice(0, 14).map(topic => {
              const isSelected = selectedTopic === topic;
              return (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(isSelected ? null : topic)}
                  className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-mono-code transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  #{topic}
                </button>
              );
            })}
          </div>

          {/* Active Filter Badges */}
          {(selectedCategory || selectedTopic || debouncedSearch) && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs text-slate-400 font-mono-code">Active Filters:</span>

              {debouncedSearch && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-300 text-xs font-mono-code border border-blue-500/30">
                  Search: &quot;{debouncedSearch}&quot;
                  <X size={12} className="cursor-pointer" onClick={() => setSearchQuery('')} />
                </span>
              )}

              {selectedCategory && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 text-xs font-mono-code border border-purple-500/30">
                  Category: {selectedCategory}
                  <X size={12} className="cursor-pointer" onClick={() => setSelectedCategory(null)} />
                </span>
              )}

              {selectedTopic && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 text-xs font-mono-code border border-cyan-500/30">
                  Topic: #{selectedTopic}
                  <X size={12} className="cursor-pointer" onClick={() => setSelectedTopic(null)} />
                </span>
              )}

              <button
                onClick={handleClearFilters}
                className="text-xs text-red-400 hover:text-red-300 underline font-mono-code ml-2 cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results Metadata */}
        <div className="flex items-center justify-between text-xs font-mono-code text-slate-400 mb-6">
          <span>Found {filteredArticles.length} matching {filteredArticles.length === 1 ? 'article' : 'articles'}</span>
          <Link to="/saved" className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
            <Bookmark size={13} />
            <span>Saved Stories ({bookmarkCount})</span>
          </Link>
        </div>

        {/* Main Grid Results */}
        {isLoading ? (
          <LoadingSkeleton type="card" count={6} />
        ) : (
          <NewsGrid
            articles={filteredArticles}
            onTopicClick={topic => setSelectedTopic(topic)}
            emptyTitle="No Dispatches Found"
            emptyDescription="No articles match your specific combination of category, search keywords, and topics."
            onReset={handleClearFilters}
          />
        )}

        {/* Recently Viewed Carousel */}
        {recentlyViewed.length > 0 && (
          <div className="mt-16 pt-8 border-t border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History size={16} className="text-blue-400" />
                <h3 className="font-bold text-slate-100 text-sm uppercase font-mono-code">
                  Recently Examined Stories
                </h3>
              </div>
              <span className="text-xs font-mono-code text-slate-500">
                Session History
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentlyViewed.slice(0, 4).map(article => (
                <div
                  key={article.id}
                  className="p-3.5 rounded-xl tech-glass border border-slate-800 hover:border-blue-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-mono-code text-slate-500 block mb-1">
                      {article.source}
                    </span>
                    <Link
                      to={`/article/${article.id}`}
                      className="font-semibold text-slate-200 hover:text-blue-400 text-xs line-clamp-2 leading-snug"
                    >
                      {article.title}
                    </Link>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex justify-between items-center text-[10px] font-mono-code text-slate-400">
                    <span>{article.category}</span>
                    <Link to={`/article/${article.id}`} className="text-blue-400 hover:underline">
                      Revisit →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
