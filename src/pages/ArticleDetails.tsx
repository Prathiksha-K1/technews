import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  ExternalLink,
  Share2,
  Bookmark,
  Check,
  Building,
  Cpu,
  Layers,
  ShieldCheck,
  Sparkles,
  Volume2,
  VolumeX,
  Radio
} from 'lucide-react';
import { useArticles } from '../hooks/useArticles';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import { CategoryBadge } from '../components/common/Badge';
import { BookmarkButton } from '../components/common/BookmarkButton';
import { IntelligencePanel } from '../components/details/IntelligencePanel';
import { ReadingProgress } from '../components/details/ReadingProgress';
import { ArticleCard } from '../components/cards/ArticleCard';
import { EmptyState } from '../components/common/EmptyState';

export const ArticleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { articles, isLoading } = useArticles();
  const { recordView } = useRecentlyViewed();

  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const article = articles.find(a => a.id === id);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Record view in session history
  useEffect(() => {
    if (article) {
      recordView(article);
      window.scrollTo(0, 0);
    }
  }, [article, recordView]);

  const toggleSpeech = () => {
    if (!synthRef.current || !article) return;

    if (isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    } else {
      synthRef.current.cancel();
      const textToRead = `${article.title}. Published by ${article.source}. ${article.fullExcerpt || article.description}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      synthRef.current.speak(utterance);
      setIsSpeaking(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-16 max-w-4xl mx-auto px-4 bg-[#080808]">
        <div className="h-8 w-32 bg-neutral-800 mb-6 animate-pulse" />
        <div className="h-12 w-3/4 bg-neutral-800 mb-4 animate-pulse" />
        <div className="h-64 w-full bg-neutral-800 mb-8 animate-pulse" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen py-20 px-4 bg-[#080808]">
        <EmptyState
          title="Article Not Located"
          description="The requested intelligence dispatch could not be found in the current dataset or live stream."
          actionText="Return to Command Center"
          onAction={() => navigate('/')}
        />
      </div>
    );
  }

  const fallbackImage = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80';
  const displayImage = !imageError && article.imageUrl ? article.imageUrl : fallbackImage;

  // Related stories in same category or sharing topics
  const relatedStories = articles
    .filter(a => a.id !== article.id && (a.category === article.category || a.topics.some(t => article.topics.includes(t))))
    .slice(0, 3);

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // fallback
    }
  };

  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).toUpperCase();

  return (
    <div className="min-h-screen pb-24 bg-[#080808]">
      {/* Scroll Reading Progress Bar */}
      <ReadingProgress />

      {/* Top Back and Breadcrumbs Navigation */}
      <div className="border-b-2 border-neutral-800 bg-black sticky top-16 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between font-mono-code text-xs">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors cursor-pointer uppercase font-bold"
          >
            <ArrowLeft size={14} />
            <span>RETURN TO WIRE</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Listen Aloud Button */}
            <button
              onClick={toggleSpeech}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase transition-colors border cursor-pointer ${
                isSpeaking
                  ? 'bg-red-600 text-white border-red-600 animate-pulse'
                  : 'bg-neutral-900 text-neutral-300 border-neutral-700 hover:text-white'
              }`}
            >
              {isSpeaking ? <VolumeX size={13} /> : <Volume2 size={13} />}
              <span>{isSpeaking ? 'STOP' : 'LISTEN'}</span>
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs transition-colors border border-neutral-700 cursor-pointer uppercase font-bold"
              title="Copy share link"
            >
              {copied ? <Check size={13} className="text-emerald-400" /> : <Share2 size={13} />}
              <span>{copied ? 'COPIED' : 'SHARE'}</span>
            </button>

            <BookmarkButton article={article} size="md" showLabel />
          </div>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        {/* Category & Verified Publisher Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 font-mono-code">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 bg-red-600 text-white text-xs font-black uppercase tracking-wider">
              {article.category}
            </span>
            {article.isLive && (
              <span className="px-2 py-0.5 bg-neutral-900 text-red-500 text-xs font-bold border border-red-600 uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping" />
                LIVE WIRE
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-neutral-400">
            <span className="flex items-center gap-1">
              <Clock size={13} />
              {article.readTimeMinutes || 3} MIN READ
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-red-500 font-bold">
              <ShieldCheck size={13} />
              VERIFIED
            </span>
          </div>
        </div>

        {/* Massive Display Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-impact text-white tracking-tight leading-none mb-4">
          {article.title}
        </h1>

        {/* Byline and Source Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y-2 border-neutral-800 mb-6 text-xs font-mono-code text-neutral-400 uppercase">
          <div>
            <span className="text-white font-bold">{article.author || 'EDITORIAL INTELLIGENCE'}</span>
            <span className="mx-2">•</span>
            <span>PUBLISHER: <strong className="text-white">{article.source}</strong></span>
          </div>

          <div>
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Hero Image */}
        <div className="overflow-hidden mb-8 border-2 border-neutral-800 bg-black relative">
          <img
            src={displayImage}
            alt={article.title}
            onError={() => setImageError(true)}
            className="w-full max-h-[460px] object-cover"
          />
          <div className="p-3 bg-neutral-950 border-t border-neutral-800 text-[11px] font-mono-code text-neutral-400 flex justify-between items-center uppercase">
            <span>DOMAIN: {article.category}</span>
            <span className="text-white font-bold">SOURCE: {article.source}</span>
          </div>
        </div>

        {/* Article Excerpt & Copyright Notice */}
        <div className="max-w-none mb-8">
          <div className="p-6 bg-neutral-900 border-2 border-neutral-800 mb-6">
            <h3 className="text-xs font-mono-code uppercase tracking-widest text-red-500 font-bold mb-2">
              CONTEXTUAL INSHORTS ABSTRACT
            </h3>
            <p className="text-base sm:text-lg text-neutral-200 leading-relaxed font-sans font-medium">
              {article.fullExcerpt || article.description}
            </p>
          </div>

          {/* Original Source Link Banner */}
          <div className="p-5 bg-neutral-950 border-2 border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono-code">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                ORIGINAL PUBLICATION DISPATCH
              </h4>
              <p className="text-xs text-neutral-400 mt-1 font-sans">
                TECHSPACE respects copyright integrity. Read the complete story directly at {article.source}.
              </p>
            </div>

            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-red-600/20 shrink-0"
            >
              <span>READ ON {article.source.toUpperCase().slice(0, 14)}</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* Topic Chips */}
        {article.topics && article.topics.length > 0 && (
          <div className="mb-8 pt-4 border-t border-neutral-800 font-mono-code">
            <h3 className="text-xs uppercase text-neutral-400 font-bold mb-3 tracking-widest">
              TAXONOMY INDICES
            </h3>
            <div className="flex flex-wrap gap-2">
              {article.topics.map((t, idx) => (
                <Link
                  key={idx}
                  to={`/explore?topic=${encodeURIComponent(t)}`}
                  className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 hover:border-red-600 text-xs font-bold uppercase transition-colors"
                >
                  #{t}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* AI Intelligence Panel */}
        <IntelligencePanel
          article={article}
          onTagClick={tag => navigate(`/explore?q=${encodeURIComponent(tag)}`)}
        />

        {/* Related Stories Section */}
        {relatedStories.length > 0 && (
          <div className="mt-16 pt-8 border-t-2 border-neutral-800">
            <div className="flex items-center justify-between mb-6 font-mono-code">
              <h3 className="text-lg font-bold text-white tracking-wider uppercase font-impact">
                RELATED DISPATCHES
              </h3>
              <Link
                to={`/explore?category=${encodeURIComponent(article.category)}`}
                className="text-xs font-bold text-red-500 hover:text-red-400 uppercase"
              >
                MORE IN {article.category} →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedStories.map(rel => (
                <ArticleCard key={rel.id} article={rel} />
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
};
