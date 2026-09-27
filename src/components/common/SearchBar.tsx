import React, { useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'SEARCH LIVE WIRE HEADLINES, ENTITIES, PROTOCOLS...',
  className = '',
  autoFocus = false
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className={`relative flex items-center w-full font-mono-code ${className}`}>
      <div className="absolute left-3.5 text-neutral-400 pointer-events-none flex items-center">
        <Search size={15} />
      </div>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full pl-10 pr-10 py-2.5 bg-neutral-900 text-white placeholder-neutral-500 text-xs sm:text-sm border-2 border-neutral-800 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all uppercase tracking-wider"
      />

      {value && (
        <button
          onClick={handleClear}
          type="button"
          aria-label="Clear search"
          className="absolute right-3 p-1 text-neutral-400 hover:text-white cursor-pointer transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
