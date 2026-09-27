import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ChevronUp,
  ChevronDown,
  Volume2,
  VolumeX,
  ExternalLink,
  Bookmark,
  Share2,
  Sparkles,
  Type,
  Play,
  Pause,
  RotateCcw,
  Check,
  Radio,
  Clock,
  Layers,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { Article } from '../../types/article';
import { useBookmarks } from '../../hooks/useBookmarks';
import { IntelligencePanel } from '../details/IntelligencePanel';

interface InshortsDeckProps {
  articles: Article[];
  initialIndex?: number;
  onArticleChange?: (article: Article) => void;
  themeCombo?: 'red-black' | 'monochrome' | 'white-black';
}

export const InshortsDeck: React.FC<InshortsDeckProps> = ({
  articles,
  initialIndex = 0,
  onArticleChange,
  themeCombo = 'red-black'
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [fontSizeMode, setFontSizeMode] = useState<'normal' | 'large' | 'xl'>('normal');
  const [showAiDrawer, setShowAiDrawer] = useState(false);
  const [copied, setCopied] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const { isBookmarked, toggleBookmark } = useBookmarks();
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const activeArticle = articles[currentIndex] || articles[0];
  const bookmarked = activeArticle ? isBookmarked(activeArticle.id) : false;

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

  const goToNext = useCallback(() => {
    if (currentIndex < articles.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0); // loop
    }
    if (synthRef.current) synthRef.current.cancel();
    setIsSpeaking(false);
  }, [currentIndex, articles.length]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      setCurrentIndex(articles.length - 1);
    }
    if (synthRef.current) synthRef.current.cancel();
    setIsSpeaking(false);
  }, [currentIndex, articles.length]);

  // Keyboard controls: Up/Down arrow, Spacebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowDown' || e.key === 'j' || e.key === ' ') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        goToPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  // Auto-play slideshow timer
  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      goToNext();
    }, 9000);

    return () => clearInterval(timer);
  }, [autoPlay, goToNext]);

  // Notify parent on change
  useEffect(() => {
    if (activeArticle) {
      onArticleChange?.(activeArticle);
    }
  }, [currentIndex, activeArticle, onArticleChange]);

  // Text to Speech
  const toggleSpeech = () => {
    if (!synthRef.current || !activeArticle) return;

    if (isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    } else {
      synthRef.current.cancel();
      const textToRead = `${activeArticle.title}. Published by ${activeArticle.source}. ${activeArticle.description}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      synthRef.current.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleShare = async () => {
    if (!activeArticle) return;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${activeArticle.title} - Read on TECHSPACE: ${window.location.origin}/article/${activeArticle.id}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // fallback
    }
  };

  // Touch Swipe navigation (Inshorts signature gesture)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;

    if (diff > 50) {
      // Swiped Up -> Next
      goToNext();
    } else if (diff < -50) {
      // Swiped Down -> Prev
      goToPrev();
    }
    setTouchStartY(null);
  };

  if (!activeArticle) return null;

  const formattedDate = new Date(activeArticle.publishedAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  const fontSizeClasses = {
    normal: {
      headline: 'text-xl sm:text-2xl md:text-3xl',
      body: 'text-sm sm:text-base leading-relaxed'
    },
    large: {
      headline: 'text-2xl sm:text-3xl md:text-4xl',
      body: 'text-base sm:text-lg leading-relaxed'
    },
    xl: {
      headline: 'text-3xl sm:text-4xl md:text-5xl',
      body: 'text-lg sm:text-xl leading-relaxed'
    }
  };

  return (
    <div
      className="relative w-full max-w-4xl mx-auto my-4 select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Deck Navigation Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-900 border-2 border-neutral-800 border-b-0 text-xs font-mono-code text-neutral-300">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-red-500 font-bold uppercase tracking-wider">
            <Radio size={12} className="animate-pulse" />
            <span>INSHORTS SNAP DECK</span>
          </span>
          <span className="text-neutral-600">|</span>
          <span className="font-bold text-white tracking-widest">
            {String(currentIndex + 1).padStart(2, '0')} / {String(articles.length).padStart(2, '0')}
          </span>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2">
          {/* Autoplay Slideshow */}
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider border cursor-pointer transition-colors ${
              autoPlay
                ? 'bg-red-600 border-red-600 text-white'
                : 'bg-black border-neutral-700 text-neutral-400 hover:text-white'
            }`}
            title="Toggle automated card slideshow"
          >
            {autoPlay ? <Pause size={12} /> : <Play size={12} />}
            <span className="hidden sm:inline">{autoPlay ? 'AUTO ON' : 'AUTO PLAY'}</span>
          </button>

          {/* Font Size Toggle */}
          <button
            onClick={() => {
              if (fontSizeMode === 'normal') setFontSizeMode('large');
              else if (fontSizeMode === 'large') setFontSizeMode('xl');
              else setFontSizeMode('normal');
            }}
            className="flex items-center gap-1 px-2.5 py-1 bg-black border border-neutral-700 text-neutral-300 hover:text-white cursor-pointer text-[11px]"
            title="Adjust reading font scale"
          >
            <Type size={12} />
            <span className="uppercase">{fontSizeMode}</span>
          </button>
        </div>
      </div>

      {/* Main Inshorts Card */}
      <div className="relative bg-neutral-950 border-2 border-neutral-800 shadow-2xl overflow-hidden min-h-[580px] flex flex-col justify-between">
        {/* Card Header & Media Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border-b border-neutral-800">
          {/* Image side */}
          <div className="md:col-span-5 relative h-56 md:h-72 bg-neutral-900 overflow-hidden">
            <img
              src={activeArticle.imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'}
              alt={activeArticle.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden" />

            {/* Category Pill on Image */}
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 bg-red-600 text-white font-mono-code text-[11px] font-bold uppercase tracking-wider shadow-lg">
                {activeArticle.category}
              </span>
            </div>

            {/* Live Indicator */}
            {activeArticle.isLive && (
              <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-black/80 border border-red-500/40 text-red-400 font-mono-code text-[10px] font-bold uppercase flex items-center gap-1.5 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                <span>LIVE WIRE</span>
              </div>
            )}
          </div>

          {/* Quick Header Meta side */}
          <div className="md:col-span-7 p-5 md:p-6 flex flex-col justify-between bg-neutral-900/60">
            <div>
              {/* Publisher & Time */}
              <div className="flex items-center justify-between gap-2 mb-3 text-xs font-mono-code text-neutral-400">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white uppercase tracking-wider">
                    {activeArticle.source}
                  </span>
                  <span>•</span>
                  <span>{formattedDate}</span>
                </div>

                <span className="flex items-center gap-1 text-neutral-400 text-[11px]">
                  <Clock size={11} />
                  {activeArticle.readTimeMinutes || 2}m read
                </span>
              </div>

              {/* Big Bold Headline */}
              <h2 className={`${fontSizeClasses[fontSizeMode].headline} font-black text-white font-display tracking-tight leading-tight mb-3`}>
                {activeArticle.title}
              </h2>
            </div>

            {/* Topics Bar */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {activeArticle.topics.slice(0, 3).map((topic, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-black border border-neutral-800 text-[11px] font-mono-code text-neutral-400"
                >
                  #{topic}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 60-Word Inshorts Editorial Content */}
        <div className="p-6 md:p-8 flex-1 bg-black">
          <div className="max-w-3xl">
            <p className={`${fontSizeClasses[fontSizeMode].body} text-neutral-200 font-sans tracking-wide leading-relaxed font-medium mb-6`}>
              {activeArticle.description}
            </p>

            {/* AI Summary Highlight Box */}
            {activeArticle.aiSummary && (
              <div className="p-4 bg-neutral-900/90 border-l-4 border-red-600 mb-6">
                <div className="flex items-center gap-2 text-xs font-mono-code text-red-500 font-bold uppercase mb-1">
                  <Sparkles size={13} />
                  <span>AI SYSTEMIC TAKEAWAY</span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-300 font-mono-code leading-relaxed">
                  {activeArticle.whyItMatters || activeArticle.aiSummary}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Bottom Bar: Every Button is Active */}
        <div className="p-4 bg-neutral-900 border-t-2 border-neutral-800 flex flex-wrap items-center justify-between gap-3">
          {/* Left Actions: Listen, Bookmark, Share */}
          <div className="flex items-center gap-2">
            {/* Listen Aloud (Speech Synthesis) */}
            <button
              onClick={toggleSpeech}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono-code font-bold uppercase border cursor-pointer transition-all ${
                isSpeaking
                  ? 'bg-red-600 text-white border-red-600 animate-pulse'
                  : 'bg-black text-neutral-300 border-neutral-700 hover:text-white hover:border-neutral-500'
              }`}
              title="Listen to headline and summary read aloud"
            >
              {isSpeaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
              <span>{isSpeaking ? 'STOP' : 'LISTEN'}</span>
            </button>

            {/* Bookmark Action */}
            <button
              onClick={() => toggleBookmark(activeArticle)}
              className={`p-2 border cursor-pointer transition-all ${
                bookmarked
                  ? 'bg-red-600/20 text-red-500 border-red-600'
                  : 'bg-black text-neutral-400 border-neutral-700 hover:text-white'
              }`}
              title={bookmarked ? 'Saved to bookmarks' : 'Bookmark story'}
            >
              <Bookmark size={16} className={bookmarked ? 'fill-red-600' : ''} />
            </button>

            {/* Share / Copy Link */}
            <button
              onClick={handleShare}
              className="p-2 bg-black border border-neutral-700 text-neutral-400 hover:text-white cursor-pointer transition-all"
              title="Copy share link"
            >
              {copied ? <Check size={16} className="text-emerald-400" /> : <Share2 size={16} />}
            </button>

            {/* AI Deep Drawer Toggle */}
            <button
              onClick={() => setShowAiDrawer(!showAiDrawer)}
              className="flex items-center gap-1 px-3 py-2 bg-black border border-neutral-700 hover:border-red-600 text-neutral-300 hover:text-red-400 text-xs font-mono-code font-bold uppercase cursor-pointer"
              title="Toggle deep AI intelligence details"
            >
              <Sparkles size={14} className="text-red-500" />
              <span className="hidden sm:inline">AI DOSSIER</span>
            </button>
          </div>

          {/* Right Action: Read Full at Source */}
          <div className="flex items-center gap-2">
            <a
              href={activeArticle.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-mono-code text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-red-600/30 cursor-pointer"
            >
              <span>READ AT {activeArticle.source.toUpperCase().slice(0, 14)}</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>

      {/* Floating Vertical Deck Controls (Inshorts style Previous / Next) */}
      <div className="flex items-center justify-between mt-3 px-2">
        <button
          onClick={goToPrev}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border-2 border-neutral-800 hover:border-neutral-600 text-neutral-300 hover:text-white font-mono-code text-xs font-bold uppercase tracking-wider cursor-pointer transition-all"
        >
          <ChevronUp size={16} />
          <span>PREVIOUS (↑)</span>
        </button>

        <span className="text-xs font-mono-code text-neutral-500 hidden sm:inline">
          Use Keyboard Arrow Keys [↑ / ↓] or Swipe
        </span>

        <button
          onClick={goToNext}
          className="flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-700 border-2 border-red-600 text-white font-mono-code text-xs font-black uppercase tracking-wider cursor-pointer transition-all shadow-md shadow-red-600/20"
        >
          <span>NEXT STORY (↓)</span>
          <ChevronDown size={16} />
        </button>
      </div>

      {/* Expanded AI Dossier Modal / Drawer */}
      {showAiDrawer && (
        <div className="mt-6 p-6 bg-neutral-950 border-2 border-red-600 rounded-none shadow-2xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
            <div className="flex items-center gap-2 font-mono-code text-sm font-bold text-red-500 uppercase">
              <Sparkles size={16} />
              <span>COGNITIVE INTELLIGENCE DOSSIER // {activeArticle.title}</span>
            </div>
            <button
              onClick={() => setShowAiDrawer(false)}
              className="px-2 py-1 bg-black border border-neutral-700 text-neutral-400 hover:text-white text-xs font-mono-code cursor-pointer"
            >
              CLOSE [ESC]
            </button>
          </div>

          <IntelligencePanel article={activeArticle} />
        </div>
      )}
    </div>
  );
};
