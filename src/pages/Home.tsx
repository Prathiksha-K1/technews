import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  Compass,
  Radio,
  Sparkles,
  TrendingUp,
  Database,
  ArrowRight,
  ShieldCheck,
  BookmarkCheck,
  Layers,
  Clock,
  PlaySquare,
  LayoutGrid,
  Zap
} from 'lucide-react';
import { useArticles } from '../hooks/useArticles';
import { HeroStory } from '../components/cards/HeroStory';
import { NewsGrid } from '../components/cards/NewsGrid';
import { CategoryFilter } from '../components/common/CategoryFilter';
import { SearchBar } from '../components/common/SearchBar';
import { StatusBanner } from '../components/common/StatusBanner';
import { TrendingTopics } from '../components/trending/TrendingTopics';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import { CompactStoryRow } from '../components/cards/CompactStoryRow';
import { InshortsDeck } from '../components/inshorts/InshortsDeck';

interface HomeProps {
  viewMode?: 'deck' | 'grid';
  onToggleViewMode?: () => void;
}

export const Home: React.FC<HomeProps> = ({
  viewMode = 'deck',
  onToggleViewMode
}) => {
  const navigate = useNavigate();
  const {
    articles,
    isLoading,
    isRefreshing,
    error,
    feedSource,
    statusMessage,
    lastUpdated,
    stats,
    computedTrends,
    refreshFeed
  } = useArticles();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDeckMode, setActiveDeckMode] = useState<'deck' | 'grid'>(viewMode);

  // Synchronize with parent viewMode prop if changed
  React.useEffect(() => {
    setActiveDeckMode(viewMode);
  }, [viewMode]);

  // Filtered stories for both modes
  const filteredArticles = articles.filter(article => {
    const matchesCategory = !selectedCategory || article.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const heroArticle = filteredArticles[0] || articles[0];
  const latestArticles = (selectedCategory || searchQuery.trim())
    ? filteredArticles
    : articles.slice(1, 10);

  const handleSelectTrend = (topic: string) => {
    navigate(`/explore?topic=${encodeURIComponent(topic)}`);
  };

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen pb-20 bg-[#080808]">
      {/* Top Status & Sync Banner */}
      <StatusBanner
        source={feedSource}
        message={statusMessage}
        lastUpdated={lastUpdated}
        isRefreshing={isRefreshing}
        onRefresh={refreshFeed}
        storyCount={articles.length}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Breaking News Marquee Ticker */}
        <div className="mb-6 p-2 bg-neutral-900 border-2 border-neutral-800 flex items-center gap-3 overflow-hidden font-mono-code text-xs">
          <span className="px-2.5 py-0.5 bg-red-600 text-white font-bold uppercase shrink-0 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            LIVE WIRE
          </span>
          <div className="flex-1 overflow-x-auto scrollbar-none whitespace-nowrap text-neutral-300">
            <span className="text-red-500 font-bold mr-2">BREAKING:</span>
            <span>{articles[0]?.title || 'Ingesting real-time technology intelligence across global APIs...'}</span>
            <span className="mx-3 text-neutral-600">///</span>
            <span className="text-neutral-400">SOURCE: {articles[0]?.source || 'Verified Wire'}</span>
          </div>
        </div>

        {/* Big Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b-2 border-neutral-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-code text-red-500 font-bold uppercase tracking-widest mb-1">
              <Zap size={14} className="fill-red-500" />
              <span>REAL-TIME TECH INTELLIGENCE WIRE</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-impact tracking-tight text-white leading-none">
              TECH<span className="text-red-600">SPACE</span> COMMAND
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mt-2 font-mono-code uppercase tracking-wider">
              REAL-TIME WORLD TECHNOLOGY REPORTING • INSHORTS 60-WORD SYNTHESIS • AI COGNITION
            </p>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-neutral-900 border-2 border-neutral-800 p-1">
              <button
                onClick={() => {
                  setActiveDeckMode('deck');
                  if (onToggleViewMode && viewMode !== 'deck') onToggleViewMode();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-code font-bold uppercase cursor-pointer transition-colors ${
                  activeDeckMode === 'deck'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <PlaySquare size={13} />
                <span>INSHORTS DECK</span>
              </button>

              <button
                onClick={() => {
                  setActiveDeckMode('grid');
                  if (onToggleViewMode && viewMode !== 'grid') onToggleViewMode();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-code font-bold uppercase cursor-pointer transition-colors ${
                  activeDeckMode === 'grid'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <LayoutGrid size={13} />
                <span>EDITORIAL GRID</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Activity Overview Metrics (Red & Black Aesthetic) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="p-4 bg-neutral-900 border-2 border-neutral-800">
            <div className="flex items-center justify-between text-neutral-400 mb-1">
              <span className="text-[11px] font-mono-code uppercase font-bold">REAL-TIME DISPATCHES</span>
              <Database size={13} className="text-red-500" />
            </div>
            <div className="text-3xl font-black font-impact text-white tracking-wider">
              {stats.totalStories}
            </div>
            <span className="text-[10px] text-neutral-500 font-mono-code uppercase">
              LIVE &amp; NORMALIZED
            </span>
          </div>

          <div className="p-4 bg-neutral-900 border-2 border-neutral-800">
            <div className="flex items-center justify-between text-neutral-400 mb-1">
              <span className="text-[11px] font-mono-code uppercase font-bold">PRIMARY DOMAINS</span>
              <Layers size={13} className="text-neutral-400" />
            </div>
            <div className="text-3xl font-black font-impact text-white tracking-wider">
              {stats.categoryCount}
            </div>
            <span className="text-[10px] text-neutral-500 font-mono-code uppercase">
              12 ACTIVE TECH DOMAINS
            </span>
          </div>

          <div className="p-4 bg-neutral-900 border-2 border-neutral-800">
            <div className="flex items-center justify-between text-neutral-400 mb-1">
              <span className="text-[11px] font-mono-code uppercase font-bold">LIVE APIS CONNECTED</span>
              <ShieldCheck size={13} className="text-red-500" />
            </div>
            <div className="text-3xl font-black font-impact text-white tracking-wider">
              {stats.uniqueSources}
            </div>
            <span className="text-[10px] text-neutral-500 font-mono-code uppercase">
              VERIFIED NEWS WIRES
            </span>
          </div>

          <div className="p-4 bg-neutral-900 border-2 border-neutral-800">
            <div className="flex items-center justify-between text-neutral-400 mb-1">
              <span className="text-[11px] font-mono-code uppercase font-bold">TOTAL READ DEPTH</span>
              <Clock size={13} className="text-neutral-400" />
            </div>
            <div className="text-3xl font-black font-impact text-white tracking-wider">
              {stats.totalReadMinutes}M
            </div>
            <span className="text-[10px] text-neutral-500 font-mono-code uppercase">
              INSHORTS DURATION
            </span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="space-y-3 mb-8">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="w-full sm:w-96">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search live tech headlines or systems..."
              />
            </div>

            <div className="w-full sm:w-auto flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-mono-code text-neutral-500 uppercase">
                Filter:
              </span>
            </div>
          </div>

          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        </div>

        {/* Loading and Error States */}
        {isLoading && <LoadingSkeleton type={activeDeckMode === 'deck' ? 'hero' : 'card'} count={4} />}
        {error && <ErrorState message={error} onRetry={refreshFeed} />}

        {/* View Mode 1: INSHORTS DECK MODE (Dailyhunt / Inshorts signature card-by-card) */}
        {!isLoading && !error && activeDeckMode === 'deck' && (
          <div className="mb-14">
            <InshortsDeck
              articles={filteredArticles.length > 0 ? filteredArticles : articles}
            />
          </div>
        )}

        {/* View Mode 2: EDITORIAL GRID MODE (Big bold typography multi-column layout) */}
        {!isLoading && !error && activeDeckMode === 'grid' && (
          <div className="mb-12">
            {!searchQuery.trim() && !selectedCategory && heroArticle && (
              <HeroStory article={heroArticle} />
            )}

            <div className="mt-8">
              <NewsGrid
                articles={latestArticles}
                onTopicClick={handleSelectTrend}
                emptyTitle="No Dispatches Found"
                emptyDescription="Try clearing your search keyword or selecting All Categories."
                onReset={() => {
                  setSelectedCategory(null);
                  setSearchQuery('');
                }}
              />
            </div>
          </div>
        )}

        {/* Trending Radar Section */}
        {!isLoading && computedTrends.length > 0 && (
          <div className="mb-12 p-6 bg-neutral-900 border-2 border-neutral-800">
            <TrendingTopics
              trends={computedTrends}
              onSelectTopic={handleSelectTrend}
              limit={4}
            />
            <div className="mt-4 pt-3 border-t border-neutral-800 flex justify-end">
              <Link
                to="/trending"
                className="text-xs font-mono-code font-bold text-red-500 hover:text-red-400 flex items-center gap-1.5 uppercase"
              >
                <span>Full Frequency Trend Dossier</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        )}

        {/* Live Dispatch Stream vs AI Cognition Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 border-t-2 border-neutral-800">
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <div className="flex items-center gap-2 font-mono-code font-bold text-xs uppercase text-red-500">
                <Radio size={14} className="animate-pulse" />
                <span>RAPID STREAM WIRE</span>
              </div>
              <Link to="/feed" className="text-xs font-mono-code text-neutral-400 hover:text-white uppercase">
                ALL FEED DISPATCHES →
              </Link>
            </div>

            <div className="space-y-2">
              {articles.slice(0, 6).map((art, idx) => (
                <CompactStoryRow key={art.id} article={art} index={idx} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 bg-neutral-900 border-2 border-red-600">
              <div className="flex items-center gap-2 text-xs font-mono-code text-red-500 font-bold uppercase mb-2">
                <Sparkles size={14} />
                <span>AI COGNITIVE SYNTHESIS</span>
              </div>
              <h3 className="text-xl font-black font-impact tracking-wide text-white mb-2">
                GEMINI 3.8 FLASH PROXY ACTIVE
              </h3>
              <p className="text-xs text-neutral-300 font-mono-code leading-relaxed mb-4">
                Full-stack server integration on Express proxies requests directly to Gemini 3.8 Flash, extracting technologies, entities, and systemic relevance without leaking API keys to the browser.
              </p>
              <Link
                to="/intelligence"
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-mono-code text-xs font-bold uppercase tracking-wider shadow-md shadow-red-600/20"
              >
                <Sparkles size={13} />
                <span>OPEN AI INTELLIGENCE</span>
              </Link>
            </div>

            <div className="p-5 bg-neutral-900 border-2 border-neutral-800">
              <div className="flex items-center gap-2 text-xs font-mono-code text-neutral-400 font-bold uppercase mb-2">
                <BookmarkCheck size={14} className="text-red-500" />
                <span>OFFLINE READING DOSSIER</span>
              </div>
              <p className="text-xs text-neutral-400 font-mono-code leading-relaxed mb-3">
                Saved stories persist client-side in localStorage. Zero tracking. Exportable to Markdown and JSON.
              </p>
              <Link
                to="/saved"
                className="text-xs font-mono-code text-red-500 hover:text-red-400 font-bold uppercase flex items-center gap-1"
              >
                <span>VIEW SAVED ARTICLES ({stats.totalStories > 0 ? 'READY' : '0'})</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
