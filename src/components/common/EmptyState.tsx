import React from 'react';
import { SearchX, FileQuestion, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: 'search' | 'bookmark' | 'general';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Stories Found',
  description = 'Try adjusting your search criteria, category filters, or explore our primary technology categories.',
  actionText = 'Reset Filters',
  onAction,
  icon = 'search'
}) => {
  return (
    <div className="w-full py-16 px-6 text-center bg-neutral-900 border-2 border-neutral-800 my-8 max-w-2xl mx-auto flex flex-col items-center font-mono-code">
      <div className="w-14 h-14 bg-black border-2 border-neutral-700 flex items-center justify-center text-red-500 mb-4">
        {icon === 'search' ? (
          <SearchX size={28} />
        ) : (
          <FileQuestion size={28} />
        )}
      </div>

      <h3 className="text-xl font-black font-impact text-white mb-2 uppercase tracking-wide">
        {title}
      </h3>
      <p className="text-xs text-neutral-400 max-w-md mx-auto mb-6 leading-relaxed">
        {description}
      </p>

      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-red-600/20 cursor-pointer"
        >
          <RotateCcw size={14} />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};
