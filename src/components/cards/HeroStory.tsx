import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Clock, ArrowRight, ExternalLink, ShieldCheck, Zap } from 'lucide-react';
import { Article } from '../../types/article';
import { BookmarkButton } from '../common/BookmarkButton';

interface HeroStoryProps {
  article: Article;
}

export const HeroStory: React.FC<HeroStoryProps> = ({ article }) => {
  const [imgError, setImgError] = useState(false);

  const fallbackImage = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';
  const displayImage = !imgError && article.imageUrl ? article.imageUrl : fallbackImage;

  return (
    <div className="relative bg-neutral-900 border-2 border-neutral-800 hover:border-red-600 transition-all duration-300 shadow-2xl mb-10 group overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left Side: Editorial Lead with Big Fonts */}
        <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between bg-neutral-950">
          <div>
            {/* Header badges */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-red-600 text-white font-mono-code text-xs font-black uppercase tracking-widest flex items-center gap-1.5 shadow-md">
                  <Zap size={13} className="fill-white" />
                  ANCHOR WIRE
                </span>
                <span className="px-2.5 py-1 bg-black border border-neutral-700 text-white font-mono-code text-xs font-bold uppercase tracking-wider">
                  {article.category}
                </span>
              </div>

              <BookmarkButton article={article} size="md" showLabel />
            </div>

            {/* Massive Bold Headline */}
            <Link to={`/article/${article.id}`} className="block group-hover:text-red-500 transition-colors">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-impact tracking-tight text-white leading-tight mb-4">
                {article.title}
              </h1>
            </Link>

            {/* 60-Word Concise Inshorts Summary */}
            <p className="text-neutral-200 text-sm sm:text-base leading-relaxed mb-6 font-sans">
              {article.description}
            </p>

            {/* AI Intelligence Highlight Box */}
            {article.whyItMatters && (
              <div className="p-4 bg-neutral-900 border-l-4 border-red-600 mb-6">
                <div className="flex items-center gap-2 text-xs font-mono-code text-red-500 font-bold uppercase mb-1">
                  <Sparkles size={14} />
                  <span>AI SYSTEMIC IMPACT TAKEAWAY</span>
                </div>
                <p className="text-xs text-neutral-300 font-mono-code leading-relaxed line-clamp-3">
                  {article.whyItMatters}
                </p>
              </div>
            )}
          </div>

          {/* Footer Metadata & CTA */}
          <div className="pt-4 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-4 font-mono-code text-xs">
            <div className="flex items-center gap-3 text-neutral-400">
              <span className="text-white font-bold uppercase">{article.source}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {article.readTimeMinutes || 3} MIN READ
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-red-500 font-bold">
                <ShieldCheck size={12} />
                VERIFIED
              </span>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 bg-black hover:bg-neutral-800 text-neutral-300 hover:text-white font-bold uppercase transition-colors border border-neutral-700"
              >
                <span>SOURCE</span>
                <ExternalLink size={12} />
              </a>

              <Link
                to={`/article/${article.id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider transition-all shadow-lg shadow-red-600/30 cursor-pointer group/cta"
              >
                <span>FULL DOSSIER</span>
                <ArrowRight size={14} className="group-hover/cta:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side: Media Asset */}
        <div className="lg:col-span-5 relative min-h-[280px] lg:min-h-full overflow-hidden bg-black border-l-2 border-neutral-800">
          <Link to={`/article/${article.id}`} className="block w-full h-full">
            <img
              src={displayImage}
              alt={article.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/90 via-black/20 to-transparent" />
          </Link>

          {/* Topics overlay */}
          {article.topics && (
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-1.5 pointer-events-none">
              {article.topics.slice(0, 3).map((topic, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-black/90 border border-neutral-700 text-[10px] font-mono-code font-bold uppercase text-neutral-300"
                >
                  #{topic}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
