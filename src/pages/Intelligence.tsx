import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Brain,
  Cpu,
  Layers,
  Building,
  RefreshCw,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useArticles } from '../hooks/useArticles';
import { apiService } from '../services/apiService';
import { Article, AIAnalysisResult } from '../types/article';
import { CategoryBadge } from '../components/common/Badge';
import { IntelligencePanel } from '../components/details/IntelligencePanel';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const Intelligence: React.FC = () => {
  const { articles, isLoading } = useArticles();
  const [selectedArticleId, setSelectedArticleId] = useState<string>('');
  const [macroSynthesis, setMacroSynthesis] = useState<{
    trendSummary: string;
    emergingThemes: Array<{ theme: string; impact: string }>;
    modelUsed: string;
  } | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  // Set default selected article
  useEffect(() => {
    if (articles.length > 0 && !selectedArticleId) {
      setSelectedArticleId(articles[0].id);
    }
  }, [articles, selectedArticleId]);

  // Load macro synthesis
  const loadMacroTrends = async () => {
    if (articles.length === 0) return;
    setIsSynthesizing(true);
    try {
      const result = await apiService.synthesizeTrends(articles);
      setMacroSynthesis(result);
    } catch {
      // fallback handled in service
    } finally {
      setIsSynthesizing(false);
    }
  };

  useEffect(() => {
    if (articles.length > 0 && !macroSynthesis) {
      loadMacroTrends();
    }
  }, [articles]);

  const activeArticle = articles.find(a => a.id === selectedArticleId) || articles[0];

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="mb-8 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-mono-code text-blue-400 font-bold uppercase mb-2">
            <Sparkles size={15} />
            <span>Cognitive Synthesis &amp; Intelligence Hub</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
                AI Article Intelligence Dashboard
              </h1>
              <p className="text-sm text-slate-400 max-w-2xl mt-1.5 leading-relaxed">
                Automated analysis engine grounded in source text. Extracts architectural developments, key technologies, named entities, and systemic industry consequences.
              </p>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-300 font-mono-code text-xs">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span>Model: Gemini 3.8 Flash Proxy</span>
            </div>
          </div>
        </div>

        {/* Global Macro Trend Synthesis Card */}
        <div className="mb-10 rounded-2xl tech-glass border border-blue-500/30 p-6 relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400">
                <Brain size={18} />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-100 text-base font-mono-code">
                  CROSS-CORPUS MACRO SYNTHESIS
                </h3>
                <span className="text-[11px] font-mono-code text-slate-400">
                  Synthesized across {articles.length} verified technology reports
                </span>
              </div>
            </div>

            <button
              onClick={loadMacroTrends}
              disabled={isSynthesizing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono-code transition-colors border border-slate-700 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={12} className={isSynthesizing ? 'animate-spin text-blue-400' : ''} />
              <span>{isSynthesizing ? 'Synthesizing...' : 'Re-synthesize Themes'}</span>
            </button>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/80 p-4 rounded-xl border border-slate-800/80 mb-4">
            {macroSynthesis?.trendSummary ||
              'Analysis of current reports highlights a decisive shift from brute-force model scaling toward inference bandwidth optimization, kernel-level memory safety with Rust, and proactive post-quantum lattice cryptography.'}
          </p>

          {/* Emerging Themes Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(macroSynthesis?.emergingThemes || [
              {
                theme: 'Inference Throughput Optimization',
                impact: 'Sub-linear acceleration mechanisms like speculative sampling lowering datacenter power thresholds.'
              },
              {
                theme: 'Memory-Safe Systems Mainlining',
                impact: 'Rust expansion into core OS kernels systematically eliminating pointer-safety CVE categories.'
              },
              {
                theme: 'Post-Quantum Infrastructure Readiness',
                impact: 'IETF standardization driving early hybrid TLS 1.4 deployments across internet backbones.'
              }
            ]).map((t, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs"
              >
                <div className="font-bold text-blue-400 font-mono-code mb-1">
                  0{idx + 1}. {t.theme}
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  {t.impact}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Story Selector & Intelligence Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Story Picker */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-200 text-xs font-mono-code uppercase">
                Select Story for Deep Analysis
              </h3>
              <span className="text-[11px] font-mono-code text-slate-500">
                {articles.length} dispatches
              </span>
            </div>

            <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
              {articles.map(art => {
                const isSelected = art.id === activeArticle?.id;

                return (
                  <div
                    key={art.id}
                    onClick={() => setSelectedArticleId(art.id)}
                    className={`p-3 rounded-xl tech-glass border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-blue-950/40 shadow-md shadow-blue-500/10'
                        : 'border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <CategoryBadge category={art.category} size="sm" />
                      <span className="text-[10px] font-mono-code text-slate-500 truncate">
                        {art.source}
                      </span>
                    </div>

                    <h4 className={`text-xs font-bold leading-snug line-clamp-2 ${
                      isSelected ? 'text-blue-300' : 'text-slate-200'
                    }`}>
                      {art.title}
                    </h4>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Intelligence Breakdown */}
          <div className="lg:col-span-8">
            {activeArticle ? (
              <div>
                <div className="p-4 rounded-xl tech-glass border border-slate-800 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-mono-code text-slate-500 block mb-1">
                      Currently Inspecting
                    </span>
                    <h2 className="text-base font-bold text-slate-100 line-clamp-1">
                      {activeArticle.title}
                    </h2>
                  </div>

                  <a
                    href={activeArticle.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono-code text-blue-400 hover:text-blue-300 underline shrink-0"
                  >
                    View Original Source ↗
                  </a>
                </div>

                <IntelligencePanel article={activeArticle} />
              </div>
            ) : (
              <LoadingSkeleton type="hero" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
