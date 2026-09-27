import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { Article } from '../../types/article';
import { CategoryBadge } from '../common/Badge';
import { BookmarkButton } from '../common/BookmarkButton';

interface CompactStoryRowProps {
  article: Article;
  index?: number;
}

export const CompactStoryRow: React.FC<CompactStoryRowProps> = ({ article, index }) => {
  return (
    <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl tech-glass border border-slate-800/80 hover:border-blue-500/40 transition-all group">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        {index !== undefined && (
          <span className="font-mono-code text-slate-500 text-sm font-semibold shrink-0 w-5 text-right mt-0.5">
            {String(index + 1).padStart(2, '0')}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <CategoryBadge category={article.category} size="sm" />
            <span className="text-[11px] font-mono-code text-slate-400 truncate">
              {article.source}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-[11px] font-mono-code text-slate-400 flex items-center gap-1 shrink-0">
              <Clock size={10} />
              {article.readTimeMinutes || 4}m
            </span>
          </div>

          <Link
            to={`/article/${article.id}`}
            className="block font-semibold text-slate-200 group-hover:text-blue-400 transition-colors text-sm line-clamp-2 leading-snug"
          >
            {article.title}
          </Link>
        </div>
      </div>

      <div className="shrink-0 flex items-center gap-2">
        <BookmarkButton article={article} size="sm" />
      </div>
    </div>
  );
};
