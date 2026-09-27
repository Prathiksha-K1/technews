import React from 'react';
import { TECH_CATEGORIES } from '../../data/categories';
import { TechCategory } from '../../types/article';
import { Layers } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  categoryCounts?: Record<string, number>;
  className?: string;
  variant?: 'chips' | 'pills' | 'sidebar';
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  className = '',
  variant = 'chips'
}) => {
  if (variant === 'sidebar') {
    return (
      <div className={`space-y-1 font-mono-code ${className}`}>
        <button
          onClick={() => onSelectCategory(null)}
          className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold uppercase transition-all cursor-pointer ${
            selectedCategory === null
              ? 'bg-red-600 text-white'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-800'
          }`}
        >
          <span className="flex items-center gap-2">
            <Layers size={13} />
            <span>ALL DOMAINS</span>
          </span>
          {categoryCounts && categoryCounts['All'] !== undefined && (
            <span className="text-[10px] px-1.5 py-0.2 bg-black text-neutral-400">
              {categoryCounts['All']}
            </span>
          )}
        </button>

        {TECH_CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat.name;
          const count = categoryCounts ? categoryCounts[cat.name] : undefined;

          return (
            <button
              key={cat.slug}
              onClick={() => onSelectCategory(isSelected ? null : cat.name)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold uppercase transition-all cursor-pointer ${
                isSelected
                  ? 'bg-red-600 text-white'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-800'
              }`}
            >
              <span className="flex items-center gap-2 truncate">
                <span className={`w-1.5 h-1.5 shrink-0 ${isSelected ? 'bg-white' : 'bg-red-600'}`} />
                <span className="truncate">{cat.name}</span>
              </span>
              {count !== undefined && (
                <span className="text-[10px] px-1.5 py-0.2 bg-black text-neutral-400">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-mono-code ${className}`}>
      {/* "All" button */}
      <button
        onClick={() => onSelectCategory(null)}
        className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
          selectedCategory === null
            ? 'bg-red-600 border-red-600 text-white shadow-md shadow-red-600/20'
            : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700'
        }`}
      >
        <span>ALL DOMAINS</span>
        {categoryCounts && categoryCounts['All'] !== undefined && (
          <span className="text-[10px] opacity-80">
            ({categoryCounts['All']})
          </span>
        )}
      </button>

      {/* Individual 12 categories */}
      {TECH_CATEGORIES.map(cat => {
        const isSelected = selectedCategory === cat.name;
        const count = categoryCounts ? categoryCounts[cat.name] : undefined;

        return (
          <button
            key={cat.slug}
            onClick={() => onSelectCategory(isSelected ? null : cat.name as TechCategory)}
            className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
              isSelected
                ? 'bg-red-600 border-red-600 text-white shadow-md shadow-red-600/20'
                : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 shrink-0 ${isSelected ? 'bg-white' : 'bg-red-600'}`}
            />
            <span>{cat.name}</span>
            {count !== undefined && (
              <span className="text-[10px] opacity-75">
                ({count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
