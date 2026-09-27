/**
 * TECHSPACE - Live Technology News & Inshorts Intelligence Portal
 * Primary Application Shell & Router Definition
 */

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { TechSpaceIntro } from './components/intro/TechSpaceIntro';

// Pages
import { Home } from './pages/Home';
import { LiveFeed } from './pages/LiveFeed';
import { Explore } from './pages/Explore';
import { ArticleDetails } from './pages/ArticleDetails';
import { Intelligence } from './pages/Intelligence';
import { Trending } from './pages/Trending';
import { SavedArticles } from './pages/SavedArticles';
import { Methodology } from './pages/Methodology';

export default function App() {
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    // Show intro on first load
    return true;
  });

  const [viewMode, setViewMode] = useState<'deck' | 'grid'>('deck');

  return (
    <>
      {showIntro && (
        <TechSpaceIntro onComplete={() => setShowIntro(false)} />
      )}

      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#080808] text-neutral-100 selection:bg-red-600 selection:text-white">
          <Navbar
            onReplayIntro={() => setShowIntro(true)}
            viewMode={viewMode}
            onToggleViewMode={() => setViewMode(v => v === 'deck' ? 'grid' : 'deck')}
          />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home viewMode={viewMode} onToggleViewMode={() => setViewMode(v => v === 'deck' ? 'grid' : 'deck')} />} />
              <Route path="/feed" element={<LiveFeed viewMode={viewMode} onToggleViewMode={() => setViewMode(v => v === 'deck' ? 'grid' : 'deck')} />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/article/:id" element={<ArticleDetails />} />
              <Route path="/intelligence" element={<Intelligence />} />
              <Route path="/trending" element={<Trending />} />
              <Route path="/saved" element={<SavedArticles />} />
              <Route path="/methodology" element={<Methodology />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer onReplayIntro={() => setShowIntro(true)} />
        </div>
      </BrowserRouter>
    </>
  );
}
