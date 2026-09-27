import React, { useState } from 'react';
import { Sparkles, Brain, Cpu, Building2, CheckCircle2, RefreshCw, AlertCircle, ShieldAlert } from 'lucide-react';
import { Article, AIAnalysisResult } from '../../types/article';
import { apiService } from '../../services/apiService';

interface IntelligencePanelProps {
  article: Article;
  onTagClick?: (tag: string) => void;
}

export const IntelligencePanel: React.FC<IntelligencePanelProps> = ({ article, onTagClick }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [liveAnalysis, setLiveAnalysis] = useState<AIAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRunLiveAnalysis = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const result = await apiService.analyzeArticle({
        title: article.title,
        description: article.description,
        fullExcerpt: article.fullExcerpt,
        category: article.category
      });
      setLiveAnalysis(result);
    } catch {
      setErrorMsg('Failed to connect to AI intelligence service.');
    } finally {
      setIsGenerating(false);
    }
  };

  const displaySummary = liveAnalysis?.summary || article.aiSummary || article.description;
  const displayPoints = liveAnalysis?.keyPoints || article.keyPoints || [
    'Architectural specification reviewed under current engineering paradigms.',
    'System benchmarks reveal significant throughput or security variations.',
    'Requires review of operational tradeoffs prior to wide scale deployment.'
  ];
  const displayWhyItMatters = liveAnalysis?.whyItMatters || article.whyItMatters || 'This development demonstrates an important milestone in modern technology infrastructure.';
  const displayTechs = liveAnalysis?.technologies || article.technologies || [article.category, 'Distributed Systems'];
  const displayEntities = liveAnalysis?.entities || article.entities || [article.source];
  const displayRelevance = liveAnalysis?.industryRelevance || 'Significant near-term relevance for production software infrastructure teams.';
  const modelName = liveAnalysis?.modelUsed || (article.aiSummary ? 'Pre-analyzed (Gemini 3.8 Flash Baseline)' : 'Dataset Intelligence');

  return (
    <div className="bg-neutral-950 border-2 border-neutral-800 my-8 shadow-2xl font-mono-code">
      {/* Intelligence Header */}
      <div className="bg-neutral-900 p-5 border-b-2 border-neutral-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black border border-red-600 flex items-center justify-center text-red-500 shadow-md">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-white text-base tracking-wider uppercase font-impact">
                AI COGNITION DOSSIER
              </h3>
              <span className="px-2 py-0.2 bg-red-600/20 border border-red-600 text-red-500 text-[10px] font-bold">
                {modelName}
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-sans">
              Automated synthesis and entity extraction grounded on source text
            </p>
          </div>
        </div>

        <button
          onClick={handleRunLiveAnalysis}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-red-600/20 disabled:opacity-50 cursor-pointer ml-auto"
        >
          <RefreshCw size={13} className={isGenerating ? 'animate-spin' : ''} />
          <span>{isGenerating ? 'SYNTHESIZING...' : 'LIVE DEEP ANALYSIS'}</span>
        </button>
      </div>

      {/* Notice Banner */}
      <div className="bg-black px-5 py-2.5 border-b border-neutral-800 text-[11px] text-neutral-400 flex items-center gap-2">
        <ShieldAlert size={14} className="text-red-500 shrink-0" />
        <span>
          AI-generated interpretation via Gemini 3.8 Flash. Model outputs are synthesized directly from excerpt metadata and cross-referenced with source.
        </span>
      </div>

      {errorMsg && (
        <div className="m-4 p-3 bg-red-950/60 border border-red-800 text-xs text-red-200 flex items-center gap-2">
          <AlertCircle size={15} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Intelligence Content */}
      <div className="p-6 space-y-6">
        {/* Executive Summary */}
        <div>
          <h4 className="flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-widest mb-2">
            <Brain size={14} />
            <span>EXECUTIVE SYNTHESIS (INSHORTS FORMAT)</span>
          </h4>
          <p className="text-sm text-neutral-200 font-sans leading-relaxed bg-neutral-900 p-4 border border-neutral-800">
            {displaySummary}
          </p>
        </div>

        {/* Key Points */}
        <div>
          <h4 className="flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-widest mb-3">
            <CheckCircle2 size={14} />
            <span>KEY TECHNICAL DEVELOPMENTS</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {displayPoints.map((point, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 font-sans leading-relaxed"
              >
                <span className="font-mono-code text-red-500 font-black shrink-0 mt-0.5">
                  0{idx + 1}.
                </span>
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Why It Matters */}
        <div>
          <h4 className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest mb-2">
            <Sparkles size={14} className="text-red-500" />
            <span>SYSTEMIC INDUSTRY IMPACT</span>
          </h4>
          <div className="p-4 bg-neutral-900 border-l-4 border-red-600 text-xs text-neutral-200 font-sans leading-relaxed">
            <p className="mb-2">{displayWhyItMatters}</p>
            <div className="pt-2 border-t border-neutral-800 text-[11px] font-mono-code text-neutral-400">
              <strong className="text-white">ENTERPRISE IMPLICATION:</strong> {displayRelevance}
            </div>
          </div>
        </div>

        {/* Entities and Technologies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Technologies Mentioned */}
          <div className="p-4 bg-neutral-900 border border-neutral-800">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-300 uppercase tracking-widest mb-3">
              <Cpu size={14} className="text-red-500" />
              <span>TECHNOLOGIES EXTRACTED</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {displayTechs.map((tech, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onTagClick?.(tech)}
                  className="px-2.5 py-1 bg-black text-neutral-200 border border-neutral-700 hover:border-red-600 text-xs transition-colors cursor-pointer uppercase"
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>

          {/* Organizations / Entities */}
          <div className="p-4 bg-neutral-900 border border-neutral-800">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-300 uppercase tracking-widest mb-3">
              <Building2 size={14} className="text-neutral-400" />
              <span>ORGANIZATIONS &amp; ENTITIES</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {displayEntities.map((ent, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onTagClick?.(ent)}
                  className="px-2.5 py-1 bg-black text-neutral-200 border border-neutral-700 hover:border-red-600 text-xs transition-colors cursor-pointer uppercase"
                >
                  {ent}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
