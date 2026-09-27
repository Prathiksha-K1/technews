import React from 'react';
import { Article } from '../../types/article';
import { ArticleCard } from './ArticleCard';
import { EmptyState } from '../common/EmptyState';

interface NewsGridProps {
  articles: Article[];
  onTopicClick?: (topic: string) => void;
  variant?: 'standard' | 'horizontal';
  emptyTitle?: string;
  emptyDescription?: string;
  onReset?: () => void;
}

export const NewsGrid: React.FC<NewsGridProps> = ({
  articles,
  onTopicClick,
  variant = 'standard',
  emptyTitle,
  emptyDescription,
  onReset
}) => {
  if (articles.length === 0) {
    return (
      <EmptyState
        title={emptyTitle || 'No Articles Found'}
        description={emptyDescription || 'Try broadening your filter criteria or search keyword.'}
        onAction={onReset}
      />
    );
  }

  if (variant === 'horizontal') {
    return (
      <div className="space-y-4">
        {articles.map(article => (
          <ArticleCard
            key={article.id}
            article={article}
            variant="horizontal"
            onTopicClick={onTopicClick}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map(article => (
        <ArticleCard
          key={article.id}
          article={article}
          onTopicClick={onTopicClick}
        />
      ))}
    </div>
  );
};
