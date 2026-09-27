import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Data Ingestion Disrupted',
  message = 'An unexpected network error occurred while synchronizing technology intelligence feeds.',
  onRetry
}) => {
  return (
    <div className="w-full py-12 px-6 bg-neutral-900 border-2 border-red-600 text-center max-w-xl mx-auto my-8 font-mono-code">
      <div className="w-12 h-12 bg-black border border-red-600 flex items-center justify-center text-red-500 mx-auto mb-3">
        <AlertTriangle size={24} />
      </div>
      <h3 className="text-lg font-bold text-white mb-1 uppercase tracking-wider">{title}</h3>
      <p className="text-xs text-neutral-400 mb-5 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-red-600/20"
        >
          <RefreshCw size={13} />
          <span>RETRY LIVE CONNECTION</span>
        </button>
      )}
    </div>
  );
};
