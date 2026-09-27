import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ExternalLink, Sparkles, ArrowRight, Share2, Check } from 'lucide-react';
import { Article } from '../../types/article';
import { CategoryBadge } from '../common/Badge';
import { BookmarkButton } from '../common/BookmarkButton';

interface ArticleCardProps {
  article: Article;
  onTopicClick?: (topic: string) => void;
  className?: string;
  variant?: 'standard' | 'compact' | 'horizontal';
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onTopicClick,
  className = '',
  variant = 'standard'
}) => {
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);

  const fallbackImage = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80';
  const displayImage = !imageError && article.imageUrl ? article.imageUrl : fallbackImage;

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));

      if (diffHrs < 1) {
        const diffMins = Math.max(1, Math.floor(diffMs / (1000 * 60)));
        return `${diffMins}M AGO`;
      }
      if (diffHrs < 24) {
        return `${diffHrs}H AGO`;
      }
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' }).toUpperCase();
    } catch {
      return 'RECENT';
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${article.title}: ${window.location.origin}/article/${article.id}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // ignore
    }
  };

  if (variant === 'horizontal') {
    return (
      <div className={`group bg-neutral-900 border-2 border-neutral-800 hover:border-red-600 transition-all p-4 flex flex-col sm:flex-row gap-4 ${className}`}>
        <Link
          to={`/article/${article.id}`}
          className="sm:w-56 h-36 overflow-hidden shrink-0 bg-black block border border-neutral-800"
        >
          <img
            src={displayImage}
            alt={article.title}
            onError={() => setImageError(true)}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 bg-red-600 text-white font-mono-code text-[10px] font-bold uppercase tracking-wider">
                  {article.category}
                </span>
                <span className="text-[11px] text-neutral-300 font-mono-code font-bold uppercase">
                  {article.source}
                </span>
                <span className="text-neutral-600">•</span>
                <span className="text-[11px] text-neutral-400 font-mono-code">
                  {formatDate(article.publishedAt)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleShare}
                  className="p-1.5 bg-black border border-neutral-700 text-neutral-400 hover:text-white cursor-pointer"
                  title="Share"
                >
                  {copied ? <Check size={13} className="text-emerald-400" /> : <Share2 size={13} />}
                </button>
                <BookmarkButton article={article} size="sm" />
              </div>
            </div>

            <Link to={`/article/${article.id}`} className="block group-hover:text-red-500 transition-colors">
              <h3 className="font-black text-white font-display text-lg sm:text-xl leading-tight line-clamp-2 mb-1.5">
                {article.title}
              </h3>
            </Link>

            <p className="text-xs text-neutral-300 line-clamp-2 mb-3 font-sans leading-relaxed">
              {article.description}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs font-mono-code text-neutral-400 pt-2 border-t border-neutral-800">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {article.readTimeMinutes || 3} MIN READ
              </span>
              {article.aiSummary && (
                <span className="flex items-center gap-1 text-red-500 font-bold">
                  <Sparkles size={11} />
                  AI BRIEF
                </span>
              )}
            </div>

            <Link
              to={`/article/${article.id}`}
              className="text-red-500 hover:text-red-400 font-bold text-xs flex items-center gap-1 uppercase tracking-wider"
            >
              <span>READ DOSSIER</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article
      className={`group bg-neutral-900 border-2 border-neutral-800 hover:border-red-600 transition-all duration-300 flex flex-col overflow-hidden ${className}`}
    >
      {/* Card Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-black border-b border-neutral-800">
        <Link to={`/article/${article.id}`} className="block w-full h-full">
          <img
            src={displayImage}
            alt={article.title}
            onError={() => setImageError(true)}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
        </Link>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-0.5 bg-red-600 text-white font-mono-code text-[10px] font-bold uppercase tracking-wider shadow-md">
            {article.category}
          </span>
        </div>

        {/* Floating Actions */}
        <div className="absolute top-3 right-3 flex items-center gap-1">
          <button
            onClick={handleShare}
            className="p-1.5 bg-black/80 border border-neutral-700 text-neutral-300 hover:text-white cursor-pointer backdrop-blur-md"
            title="Share story"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Share2 size={13} />}
          </button>
          <BookmarkButton article={article} size="sm" />
        </div>

        {/* Reading time */}
        <div className="absolute bottom-2.5 right-3 px-2 py-0.5 bg-black/80 border border-neutral-700 text-[10px] text-neutral-300 font-mono-code flex items-center gap-1">
          <Clock size={10} />
          <span>{article.readTimeMinutes || 3}M READ</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-neutral-950">
        <div>
          {/* Metadata */}
          <div className="flex items-center gap-2 text-xs font-mono-code text-neutral-400 mb-2">
            <span className="font-bold text-white uppercase tracking-wider truncate max-w-[130px]">
              {article.source}
            </span>
            <span>•</span>
            <span>{formatDate(article.publishedAt)}</span>
            {article.isLive && (
              <>
                <span>•</span>
                <span className="text-red-500 font-bold text-[10px] uppercase">
                  LIVE WIRE
                </span>
              </>
            )}
          </div>

          {/* Big Bold Headline */}
          <Link
            to={`/article/${article.id}`}
            className="block text-white group-hover:text-red-500 transition-colors mb-2.5"
          >
            <h3 className="font-black text-lg sm:text-xl font-display leading-tight line-clamp-2">
              {article.title}
            </h3>
          </Link>

          {/* Excerpt */}
          <p className="text-xs text-neutral-300 line-clamp-3 mb-4 leading-relaxed font-sans">
            {article.description}
          </p>
        </div>

        {/* Footer info: Topics & Action */}
        <div>
          {/* Topic tags */}
          {article.topics && article.topics.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {article.topics.slice(0, 3).map((topic, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    onTopicClick?.(topic);
                  }}
                  className="px-2 py-0.5 bg-black border border-neutral-800 hover:border-neutral-600 text-neutral-400 hover:text-white text-[10px] font-mono-code transition-colors cursor-pointer uppercase"
                >
                  #{topic}
                </button>
              ))}
            </div>
          )}

          <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs font-mono-code">
            <Link
              to={`/article/${article.id}`}
              className="font-bold text-red-500 hover:text-red-400 inline-flex items-center gap-1 uppercase tracking-wider group/link"
            >
              <span>INSPECT</span>
              <span className="group-hover/link:translate-x-1 transition-transform">→</span>
            </Link>

            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="text-neutral-400 hover:text-white inline-flex items-center gap-1 text-[11px] uppercase tracking-wider"
              title="Open original publication link"
            >
              <span>SOURCE</span>
              <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};
