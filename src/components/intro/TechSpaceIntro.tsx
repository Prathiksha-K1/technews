import React, { useState, useEffect } from 'react';
import { ArrowRight, Radio, ShieldCheck, Terminal, Cpu } from 'lucide-react';

interface TechSpaceIntroProps {
  onComplete: () => void;
}

export const TechSpaceIntro: React.FC<TechSpaceIntroProps> = ({ onComplete }) => {
  const fullTitle = 'TECHSPACE';
  const fullSubtitle = 'REAL-TIME GLOBAL TECHNOLOGY WIRE & INTELLIGENCE';
  
  const [typedTitle, setTypedTitle] = useState('');
  const [typedSubtitle, setTypedSubtitle] = useState('');
  const [progress, setProgress] = useState(0);
  const [bootStep, setBootStep] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const telemetryLogs = [
    'CONNECTING TO GLOBAL TECH SATELLITE & APIS...',
    'INGESTING LIVE WIRE: ARS TECHNICA, THE VERGE, HACKER NEWS...',
    'PROCESSING 60-WORD INSHORTS SYNTHESIS & AI COGNITION...',
    'LIVE FEED SYNCHRONIZED — WELCOME TO TECHSPACE'
  ];

  // 1. Typing animation for main title: TECHSPACE
  useEffect(() => {
    let titleIdx = 0;
    const titleInterval = setInterval(() => {
      if (titleIdx <= fullTitle.length) {
        setTypedTitle(fullTitle.slice(0, titleIdx));
        titleIdx++;
      } else {
        clearInterval(titleInterval);
      }
    }, 110); // ~1 second to type TECHSPACE

    return () => clearInterval(titleInterval);
  }, []);

  // 2. Typing animation for subtitle after title completes
  useEffect(() => {
    const timer = setTimeout(() => {
      let subIdx = 0;
      const subInterval = setInterval(() => {
        if (subIdx <= fullSubtitle.length) {
          setTypedSubtitle(fullSubtitle.slice(0, subIdx));
          subIdx++;
        } else {
          clearInterval(subInterval);
        }
      }, 35); // ~1.5 seconds

      return () => clearInterval(subInterval);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // 3. Telemetry step progression
  useEffect(() => {
    const step1 = setTimeout(() => setBootStep(1), 1800);
    const step2 = setTimeout(() => setBootStep(2), 2900);
    const step3 = setTimeout(() => setBootStep(3), 4100);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
    };
  }, []);

  // 4. Progress bar counter from 0 to 100% over 5.5 seconds
  useEffect(() => {
    const start = Date.now();
    const duration = 5500; // 5.5 seconds total

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed >= duration) {
        clearInterval(interval);
        handleExit();
      }
    }, 40);

    return () => clearInterval(interval);
  }, []);

  const handleExit = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 600); // smooth fade transition
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-between bg-white text-black font-sans px-6 sm:px-12 py-10 transition-all duration-700 select-none ${
        isExiting ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b-2 border-black pb-4">
        <div className="flex items-center gap-3">
          <span className="w-3.5 h-3.5 bg-black" />
          <span className="font-mono-code font-bold tracking-widest text-xs uppercase">
            SYS.INIT // PROTOCOL 2026.4
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 font-mono-code text-xs text-neutral-600">
            <Radio size={14} className="animate-pulse text-red-600" />
            <span>CONNECTING LIVE WIRE</span>
          </div>

          <button
            onClick={handleExit}
            className="flex items-center gap-2 px-4 py-1.5 bg-black hover:bg-neutral-800 text-white font-mono-code text-xs font-bold uppercase tracking-wider rounded-none cursor-pointer transition-transform hover:translate-x-0.5"
          >
            <span>ENTER WIRE</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Center Cinematic Display */}
      <div className="max-w-4xl mx-auto my-auto w-full text-center py-8">
        {/* Editorial Sub-badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white font-mono-code text-xs font-bold uppercase tracking-widest mb-6">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
          <span>LIVE TECHNOLOGY INTELLIGENCE PORTAL</span>
        </div>

        {/* Massive Bold Caps Title with Typing Animation */}
        <div className="relative mb-4">
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-black font-impact tracking-tighter text-black leading-none">
            {typedTitle}
            <span className="inline-block w-3 sm:w-5 h-12 sm:h-20 bg-black ml-2 animate-pulse align-middle" />
          </h1>
        </div>

        {/* Subtitle with typing animation */}
        <p className="font-mono-code font-bold text-xs sm:text-sm tracking-widest text-neutral-800 max-w-2xl mx-auto uppercase min-h-[1.5rem]">
          {typedSubtitle}
        </p>

        {/* Live Telemetry Boot Log */}
        <div className="mt-10 max-w-lg mx-auto bg-neutral-100 border-2 border-black p-4 text-left">
          <div className="flex items-center justify-between text-[11px] font-mono-code font-bold text-neutral-500 border-b border-neutral-300 pb-2 mb-2">
            <span className="flex items-center gap-1.5 text-black">
              <Terminal size={12} />
              <span>TERMINAL TELEMETRY</span>
            </span>
            <span>{progress}%</span>
          </div>

          <div className="space-y-1 font-mono-code text-xs">
            {telemetryLogs.slice(0, bootStep + 1).map((log, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-red-600 font-bold font-mono">›</span>
                <span className={i === bootStep ? 'font-bold text-black' : 'text-neutral-600'}>
                  {log}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Progress Bar & Credits */}
      <div className="w-full max-w-4xl mx-auto border-t-2 border-black pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-code text-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="font-bold text-black">INITIALIZING:</span>
          <div className="flex-1 sm:w-64 h-2 bg-neutral-200 border border-black overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-bold">{progress}%</span>
        </div>

        <div className="flex items-center gap-4 text-neutral-600 text-[11px]">
          <span>LIVE APIS: ARS TECHNICA / VERGE / HACKER NEWS</span>
          <span>•</span>
          <span className="text-black font-bold">ENTERING AUTOMATICALLY IN {Math.max(1, Math.ceil((100 - progress) / 18))}s</span>
        </div>
      </div>
    </div>
  );
};
