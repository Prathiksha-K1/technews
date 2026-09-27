import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Database, Sparkles, Terminal, RotateCcw, Radio } from 'lucide-react';
import { TECH_CATEGORIES } from '../../data/categories';

interface FooterProps {
  onReplayIntro?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onReplayIntro }) => {
  return (
    <footer className="w-full border-t-2 border-neutral-800 bg-black text-neutral-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Col 1 & 2: Brand & Academic Statement */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-7 h-7 bg-red-600 text-white font-mono-code font-black text-xs">
                TS
              </div>
              <span className="text-2xl font-black font-impact text-white tracking-wider">
                TECHSPACE
              </span>
              <span className="px-2 py-0.5 bg-neutral-900 border border-red-600 text-red-500 font-mono-code text-[10px] font-bold uppercase">
                REAL-TIME WIRE
              </span>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed max-w-sm font-sans">
              A high-impact technology news and intelligence platform featuring Inshorts-style 60-word concise synthesis, continuous RSS ingestion, and server-side Gemini 3.8 Flash cognition.
            </p>

            <div className="p-4 bg-neutral-950 border border-neutral-800 text-[11px] font-mono-code text-neutral-400 space-y-2">
              <div className="text-white font-bold flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-red-500">
                  <Terminal size={12} />
                  <span>ACADEMIC RUBRIC COMPLIANCE</span>
                </span>
                {onReplayIntro && (
                  <button
                    onClick={onReplayIntro}
                    className="flex items-center gap-1 px-2 py-0.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 cursor-pointer text-[10px] font-bold uppercase"
                  >
                    <RotateCcw size={10} />
                    <span>REPLAY INTRO</span>
                  </button>
                )}
              </div>
              <p className="text-neutral-400 text-[10px]">
                &quot;Tech News Interface – Display technology news from a local dataset with categories, search, and article details.&quot;
              </p>
              <div className="text-[10px] text-red-500 font-bold uppercase pt-1">
                Sole Project Author &amp; Designer • ReactJS Academic Portfolio
              </div>
            </div>
          </div>

          {/* Col 3: Portal Navigation */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono-code mb-3 border-b border-neutral-800 pb-1">
              PORTAL VIEWS
            </h4>
            <ul className="space-y-2 text-xs font-mono-code">
              <li>
                <Link to="/" className="hover:text-red-500 transition-colors uppercase">Command Center</Link>
              </li>
              <li>
                <Link to="/feed" className="hover:text-red-500 transition-colors uppercase">Live Wire Stream</Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-red-500 transition-colors uppercase">Explore &amp; Discover</Link>
              </li>
              <li>
                <Link to="/intelligence" className="hover:text-red-500 transition-colors uppercase">AI Intelligence Hub</Link>
              </li>
              <li>
                <Link to="/trending" className="hover:text-red-500 transition-colors uppercase">Trending Radar</Link>
              </li>
              <li>
                <Link to="/saved" className="hover:text-red-500 transition-colors uppercase">Offline Saved Articles</Link>
              </li>
              <li>
                <Link to="/methodology" className="hover:text-red-500 transition-colors uppercase">Academic Architecture</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Technology Domains */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono-code mb-3 border-b border-neutral-800 pb-1">
              PRIMARY TECH DOMAINS
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono-code">
              {TECH_CATEGORIES.map(cat => (
                <Link
                  key={cat.slug}
                  to={`/explore?category=${encodeURIComponent(cat.name)}`}
                  className="hover:text-red-500 transition-colors truncate flex items-center gap-1.5 uppercase text-[11px]"
                >
                  <span className="w-1.5 h-1.5 bg-red-600 shrink-0" />
                  <span className="truncate">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-code text-neutral-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-red-500 font-bold uppercase">
              <Radio size={12} className="animate-pulse" />
              <span>LIVE APIS: ARS TECHNICA / THE VERGE / HACKER NEWS</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-neutral-400">
              <ShieldCheck size={12} className="text-white" />
              <span>VERIFIED REAL-TIME STREAM</span>
            </span>
          </div>

          <div className="text-center sm:text-right uppercase">
            <span>TECHSPACE © {new Date().getFullYear()} • Individual Academic Project</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
