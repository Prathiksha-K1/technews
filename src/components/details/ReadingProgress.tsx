import React, { useState, useEffect } from 'react';

export const ReadingProgress: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const scrolled = (totalScroll / windowHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, scrolled)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (scrollProgress <= 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-slate-900">
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 reading-bar transition-all"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
};
