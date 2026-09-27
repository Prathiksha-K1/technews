import React, { useState } from 'react';
import {
  TrendingUp,
  Hash,
  Layers,
  ArrowRight,
  Sparkles,
  BarChart3,
  Calendar,
  Clock
} from 'lucide-react';
import { useArticles } from '../hooks/useArticles';
import { TrendTopic, Article } from '../types/article';
import { CategoryBadge } from '../components/common/Badge';
import { ArticleCard } from '../components/cards/ArticleCard';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const Trending: React.FC = () => {
  const { articles, computedTrends, isLoading } = useArticles();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const activeTrend = selectedTopic
    ? computedTrends.find(t => t.topic === selectedTopic) || computedTrends[0]
    : computedTrends[0];

  // Articles related to the active trend
  const matchingArticles = activeTrend
    ? articles.filter(a => a.topics.includes(activeTrend.topic) || a.category === activeTrend.category)
    : [];

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="mb-8 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-400 font-bold uppercase mb-2">
            <TrendingUp size={15} />
            <span>Dataset Frequency Radar</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Technology Trend Discovery
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mt-1.5 leading-relaxed">
            Recurring technological topics and architectural shifts calculated deterministically from currently ingested dispatches.
          </p>
        </div>

        {/* Statistical Methodology Disclaimer Banner */}
        <div className="mb-8 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono-code text-slate-400 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BarChart3 size={15} className="text-cyan-400 shrink-0" />
            <span>
              Verified Metric Policy: Trend velocity &amp; frequency metrics are calculated exclusively from the application&apos;s active {articles.length} stories. No synthetic numbers.
            </span>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Active Dataset Indices: {computedTrends.length} Topics
          </span>
        </div>

        {isLoading ? (
          <LoadingSkeleton type="hero" />
        ) : (
          <>
            {/* Top Trends Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {computedTrends.slice(0, 9).map(trend => {
                const isSelected = activeTrend?.topic === trend.topic;

                return (
                  <div
                    key={trend.topic}
                    onClick={() => setSelectedTopic(trend.topic)}
                    className={`p-5 rounded-2xl tech-glass border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/30 shadow-lg shadow-cyan-500/10'
                        : 'border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <CategoryBadge category={trend.category} size="sm" />
                        <span className="text-xs font-mono-code font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                          {trend.storyCount} {trend.storyCount === 1 ? 'dispatch' : 'dispatches'}
                        </span>
                      </div>

                      <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-1.5 mb-2">
                        <Hash size={16} className="text-cyan-400" />
                        <span>{trend.topic}</span>
                      </h3>

                      <p className="text-xs text-slate-400 leading-relaxed mb-4">
                        {trend.description}
                      </p>
                    </div>

                    <div>
                      {/* Velocity Meter */}
                      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono-code text-slate-400">
                        <span className="text-[11px]">Momentum: {trend.velocityScore}/100</span>
                        <span className="text-cyan-400 text-xs font-semibold">
                          {isSelected ? 'Viewing Stories ↓' : 'Inspect Trend →'}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                          style={{ width: `${trend.velocityScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Focused Trend Investigation View */}
            {activeTrend && (
              <div className="mt-12 pt-8 border-t border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-400 font-semibold mb-1">
                      <span>Active Trend Dossier</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                      <Hash size={24} className="text-cyan-400" />
                      <span>Stories Covering {activeTrend.topic}</span>
                    </h2>
                  </div>

                  <span className="text-xs font-mono-code text-slate-400 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                    Category: <strong className="text-slate-200">{activeTrend.category}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matchingArticles.map(art => (
                    <ArticleCard key={art.id} article={art} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
