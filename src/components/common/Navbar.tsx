import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  Activity,
  Radio,
  Compass,
  Sparkles,
  TrendingUp,
  Bookmark,
  PlusCircle,
  Menu,
  X,
  BookOpen,
  Search,
  PlaySquare,
  LayoutGrid,
  RotateCcw,
  Zap
} from 'lucide-react';
import { useBookmarks } from '../../hooks/useBookmarks';
import { SubmitArticleModal } from '../submit/SubmitArticleModal';

interface NavbarProps {
  onSearchOpen?: () => void;
  onReplayIntro?: () => void;
  viewMode?: 'deck' | 'grid';
  onToggleViewMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSearchOpen,
  onReplayIntro,
  viewMode,
  onToggleViewMode
}) => {
  const { bookmarkCount } = useBookmarks();
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'COMMAND', path: '/', icon: Activity },
    { label: 'LIVE WIRE', path: '/feed', icon: Radio },
    { label: 'EXPLORE', path: '/explore', icon: Compass },
    { label: 'AI INTEL', path: '/intelligence', icon: Sparkles },
    { label: 'TRENDING', path: '/trending', icon: TrendingUp },
    {
      label: 'SAVED',
      path: '/saved',
      icon: Bookmark,
      badge: bookmarkCount > 0 ? bookmarkCount : null
    },
    { label: 'DOCS', path: '/methodology', icon: BookOpen }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-black border-b-2 border-neutral-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Brand Logo - Bold Caps TECHSPACE */}
            <Link to="/" className="flex items-center gap-3 shrink-0 group">
              <div className="w-8 h-8 bg-red-600 flex items-center justify-center font-mono-code font-black text-white text-base">
                TS
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black font-impact tracking-wider text-white group-hover:text-red-500 transition-colors">
                    TECHSPACE
                  </span>
                  <span className="px-1.5 py-0.2 bg-red-600/20 border border-red-600 text-red-500 text-[10px] font-mono-code font-bold uppercase tracking-widest hidden sm:inline-block">
                    LIVE
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400 font-mono-code tracking-widest hidden md:block uppercase">
                  Real-Time Technology Wire
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-code font-bold uppercase tracking-wider transition-all duration-150 ${
                      isActive
                        ? 'bg-neutral-900 text-red-500 border border-red-600'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent'
                    }`}
                  >
                    <Icon size={13} className={isActive ? 'text-red-500' : 'text-neutral-500'} />
                    <span>{item.label}</span>
                    {item.badge !== null && item.badge !== undefined && (
                      <span className="ml-1 px-1.5 py-0.2 bg-red-600 text-white text-[10px] font-mono-code font-bold">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {/* Right Quick Controls */}
            <div className="flex items-center gap-2">
              {/* Toggle Inshorts / Grid View Mode */}
              {onToggleViewMode && (
                <button
                  onClick={onToggleViewMode}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-900 border border-neutral-700 hover:border-red-600 text-xs font-mono-code font-bold uppercase text-neutral-200 hover:text-white cursor-pointer transition-colors"
                  title="Toggle Inshorts card view vs grid view"
                >
                  {viewMode === 'deck' ? <LayoutGrid size={14} className="text-red-500" /> : <PlaySquare size={14} className="text-red-500" />}
                  <span className="hidden sm:inline">{viewMode === 'deck' ? 'GRID' : 'INSHORTS'}</span>
                </button>
              )}

              {/* Replay Intro Animation Button */}
              {onReplayIntro && (
                <button
                  onClick={onReplayIntro}
                  className="hidden md:flex items-center gap-1 px-2.5 py-1.5 bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-neutral-400 hover:text-white text-xs font-mono-code cursor-pointer"
                  title="Replay 5s opening animation"
                >
                  <RotateCcw size={12} />
                  <span>INTRO</span>
                </button>
              )}

              {/* Search Trigger */}
              <Link
                to="/explore"
                className="p-2 bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-neutral-300 hover:text-white cursor-pointer"
                title="Search wire"
              >
                <Search size={15} />
              </Link>

              {/* Submit Story Button (Academic requirement #9) */}
              <button
                onClick={() => setIsSubmitOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-mono-code font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-red-600/20"
              >
                <PlusCircle size={13} />
                <span>DISPATCH</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 bg-neutral-900 border border-neutral-700 text-white cursor-pointer"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-800 bg-neutral-950 px-4 py-4 space-y-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 font-mono-code text-xs font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-neutral-900 text-red-500 border border-red-600'
                      : 'text-neutral-300 hover:bg-neutral-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={15} className={isActive ? 'text-red-500' : 'text-neutral-500'} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && item.badge !== undefined && (
                    <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-mono-code font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-2 border-t border-neutral-800 flex flex-col gap-2">
              {onReplayIntro && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onReplayIntro();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-700 text-neutral-300 font-mono-code text-xs font-bold uppercase cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>REPLAY OPENING ANIMATION</span>
                </button>
              )}

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsSubmitOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white font-mono-code text-xs font-black uppercase tracking-wider cursor-pointer"
              >
                <PlusCircle size={14} />
                <span>SUBMIT STORY DISPATCH</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Submit Article Modal */}
      <SubmitArticleModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
      />
    </>
  );
};
