import React from 'react';
import { RefreshCw, Radio, Database, ShieldCheck, Zap } from 'lucide-react';

interface StatusBannerProps {
  source: 'live' | 'fallback';
  message: string;
  lastUpdated: string;
  isRefreshing: boolean;
  onRefresh: () => void;
  storyCount?: number;
}

export const StatusBanner: React.FC<StatusBannerProps> = ({
  source,
  message,
  lastUpdated,
  isRefreshing,
  onRefresh,
  storyCount
}) => {
  const isLive = source === 'live';

  const formattedTime = new Date(lastUpdated).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div
      className={`w-full border-b-2 px-4 py-2 transition-all text-xs font-mono-code ${
        isLive
          ? 'bg-neutral-950 border-red-600/40 text-neutral-200'
          : 'bg-neutral-950 border-neutral-800 text-neutral-300'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Source Status */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            {isLive ? (
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
              </span>
            ) : (
              <span className="h-2 w-2 rounded-full bg-neutral-600" />
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-red-500 uppercase tracking-widest text-[11px]">
              {isLive ? 'LIVE WIRE SYNC' : 'SYSTEM STATUS'}
            </span>
            <span className="text-neutral-600">•</span>
            <span className="text-white font-medium uppercase tracking-wider text-[11px]">
              {message}
            </span>
            {storyCount !== undefined && (
              <span className="hidden sm:inline-block px-1.5 py-0.2 bg-neutral-900 border border-neutral-700 text-neutral-300 text-[10px] font-bold">
                {storyCount} DISPATCHES
              </span>
            )}
          </div>
        </div>

        {/* Right: Sync Controls & Timestamps */}
        <div className="flex items-center gap-4 text-neutral-400 ml-auto sm:ml-0 text-[11px]">
          <div className="hidden md:flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-red-500" />
            <span>SYNCED: {formattedTime}</span>
          </div>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1 bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 hover:border-red-600 transition-all cursor-pointer font-bold uppercase disabled:opacity-50"
            title="Refresh live feeds"
          >
            <RefreshCw
              size={11}
              className={`${isRefreshing ? 'animate-spin text-red-500' : ''}`}
            />
            <span>{isRefreshing ? 'SYNCING...' : 'SYNC WIRE'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
