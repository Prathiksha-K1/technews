import React from 'react';
import { TrendingUp, Hash, ArrowUpRight } from 'lucide-react';
import { TrendTopic } from '../../types/article';
import { CategoryBadge } from '../common/Badge';

interface TrendingTopicsProps {
  trends: TrendTopic[];
  onSelectTopic?: (topic: string) => void;
  selectedTopic?: string | null;
  limit?: number;
  className?: string;
}

export const TrendingTopics: React.FC<TrendingTopicsProps> = ({
  trends,
  onSelectTopic,
  selectedTopic,
  limit = 8,
  className = ''
}) => {
  const displayedTrends = trends.slice(0, limit);

  return (
    <div className={`space-y-3 font-mono-code ${className}`}>
      <div className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-black border border-red-600 text-red-500">
            <TrendingUp size={15} />
          </div>
          <h3 className="font-black text-white text-xs tracking-widest uppercase">
            TRENDING TOPICS RADAR // DATASET FREQUENCY
          </h3>
        </div>
        <span className="text-[11px] text-neutral-500 uppercase">
          LIVE VELOCITY
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {displayedTrends.map(trend => {
          const isSelected = selectedTopic === trend.topic;

          return (
            <div
              key={trend.topic}
              onClick={() => onSelectTopic?.(trend.topic)}
              className={`p-3.5 bg-neutral-950 border-2 transition-all cursor-pointer group flex flex-col justify-between ${
                isSelected
                  ? 'border-red-600 shadow-lg shadow-red-600/20'
                  : 'border-neutral-800 hover:border-red-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-black border border-neutral-700 text-[10px] font-bold text-neutral-300 uppercase">
                    {trend.category}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 bg-red-600 text-white">
                    {trend.storyCount} {trend.storyCount === 1 ? 'STORY' : 'STORIES'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 font-bold text-white group-hover:text-red-500 transition-colors text-sm mb-1.5 uppercase font-sans">
                  <Hash size={13} className="text-red-500 shrink-0" />
                  <span className="truncate">{trend.topic}</span>
                </div>

                <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed mb-3 font-sans">
                  {trend.description}
                </p>
              </div>

              {/* Velocity Meter */}
              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-[10px] text-neutral-400">
                <div className="flex items-center gap-1.5 flex-1 mr-2">
                  <span>VELOCITY:</span>
                  <div className="h-1.5 flex-1 bg-black border border-neutral-800 overflow-hidden">
                    <div
                      className="h-full bg-red-600 transition-all"
                      style={{ width: `${trend.velocityScore}%` }}
                    />
                  </div>
                </div>

                <span className="text-red-500 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform uppercase">
                  VIEW <ArrowUpRight size={10} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
