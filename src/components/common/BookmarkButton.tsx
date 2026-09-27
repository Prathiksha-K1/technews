import React from 'react';
import { Bookmark } from 'lucide-react';
import { Article } from '../../types/article';
import { useBookmarks } from '../../hooks/useBookmarks';

interface BookmarkButtonProps {
  article: Article;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  article,
  size = 'md',
  showLabel = false,
  className = ''
}) => {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(article.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(article);
  };

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-xs',
    lg: 'px-3 py-2 text-xs'
  };

  const iconSizes = {
    sm: 13,
    md: 15,
    lg: 17
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark story'}
      className={`inline-flex items-center gap-1.5 font-mono-code font-bold uppercase transition-all duration-150 cursor-pointer border ${
        bookmarked
          ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-600/30'
          : 'bg-black text-neutral-400 border-neutral-700 hover:text-white hover:border-neutral-500'
      } ${sizeClasses[size]} ${className}`}
      title={bookmarked ? 'Story Saved' : 'Save Story'}
    >
      <Bookmark
        size={iconSizes[size]}
        className={`transition-transform duration-200 ${bookmarked ? 'fill-white scale-105' : ''}`}
      />
      {showLabel && (
        <span className="font-bold text-[11px] tracking-wider">
          {bookmarked ? 'SAVED' : 'SAVE'}
        </span>
      )}
    </button>
  );
};
