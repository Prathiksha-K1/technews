import React from 'react';
import { getCategoryMeta } from '../../data/categories';

interface CategoryBadgeProps {
  category: string;
  size?: 'sm' | 'md';
  onClick?: () => void;
  className?: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  size = 'sm',
  onClick,
  className = ''
}) => {
  const meta = getCategoryMeta(category);
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 font-mono-code font-bold uppercase tracking-wider border transition-all bg-black text-neutral-200 border-neutral-700 hover:border-red-600 ${
        onClick ? 'cursor-pointer hover:text-red-500' : ''
      } ${sizeClass} ${className}`}
    >
      <span className="w-1.5 h-1.5 bg-red-600 shrink-0" />
      <span>{category}</span>
    </span>
  );
};
