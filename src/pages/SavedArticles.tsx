import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  Trash2,
  Download,
  Share2,
  Clock,
  ExternalLink,
  Search,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { useBookmarks } from '../hooks/useBookmarks';
import { CategoryBadge } from '../components/common/Badge';
import { SearchBar } from '../components/common/SearchBar';
import { CategoryFilter } from '../components/common/CategoryFilter';
import { EmptyState } from '../components/common/EmptyState';

export const SavedArticles: React.FC = () => {
  const { bookmarks, removeBookmark, clearAllBookmarks } = useBookmarks();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Filter bookmarks
  const filtered = useMemo(() => {
    return bookmarks.filter(article => {
      const matchesCat = !selectedCategory || article.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.description.toLowerCase().includes(q) ||
        article.source.toLowerCase().includes(q) ||
        article.topics.some(t => t.toLowerCase().includes(q));

      return matchesCat && matchesSearch;
    });
  }, [bookmarks, selectedCategory, searchQuery]);

  // Export reading list as JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(bookmarks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `techpulse-saved-articles-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setExportNotice('Exported reading list to JSON file.');
    setTimeout(() => setExportNotice(null), 3000);
  };

  // Export reading list as Markdown
  const handleExportMarkdown = () => {
    const mdLines = [
      '# TECHPULSE - Saved Technology Dispatches',
      `Exported: ${new Date().toLocaleString()}`,
      `Total Stories: ${bookmarks.length}\n`,
      ...bookmarks.map(
        (b, i) =>
          `### ${i + 1}. [${b.title}](${b.sourceUrl})\n- **Category**: ${b.category}\n- **Source**: ${b.source}\n- **Summary**: ${b.description}\n- **Topics**: ${b.topics.join(', ')}\n`
      )
    ];

    const dataStr = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(mdLines.join('\n'));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `techpulse-reading-list-${new Date().toISOString().slice(0, 10)}.md`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setExportNotice('Exported reading list to Markdown.');
    setTimeout(() => setExportNotice(null), 3000);
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-code text-blue-400 font-bold uppercase mb-2">
              <Bookmark size={15} />
              <span>Offline Reading Dossier</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
              Saved Technology Articles
            </h1>
            <p className="text-sm text-slate-400 max-w-xl mt-1.5 leading-relaxed">
              Persisted in your local browser storage. Access dispatches anytime, search saved topics, or export your personal reading list.
            </p>
          </div>

          {bookmarks.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleExportMarkdown}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono-code transition-colors border border-slate-700 cursor-pointer"
                title="Export as Markdown"
              >
                <Download size={13} />
                <span>Export Markdown</span>
              </button>

              <button
                onClick={handleExportJSON}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono-code transition-colors border border-slate-700 cursor-pointer"
                title="Export as JSON"
              >
                <Download size={13} />
                <span>Export JSON</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Clear all saved bookmarks from your browser?')) {
                    clearAllBookmarks();
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/40 text-red-300 text-xs font-mono-code transition-colors border border-red-800/40 cursor-pointer"
              >
                <Trash2 size={13} />
                <span>Clear All</span>
              </button>
            </div>
          )}
        </div>

        {exportNotice && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs font-mono-code flex items-center gap-2">
            <CheckCircle2 size={15} />
            <span>{exportNotice}</span>
          </div>
        )}

        {bookmarks.length === 0 ? (
          <EmptyState
            icon="bookmark"
            title="Your Reading List is Empty"
            description="You haven't bookmarked any technology intelligence reports yet. Explore the command center or live feed and tap the bookmark icon to save stories."
            actionText="Discover Stories"
            onAction={() => window.location.href = '/explore'}
          />
        ) : (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="space-y-4">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search within saved bookmarks..."
              />

              <CategoryFilter
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>

            {/* Bookmarks Counter */}
            <div className="text-xs font-mono-code text-slate-400">
              Showing {filtered.length} of {bookmarks.length} saved {bookmarks.length === 1 ? 'story' : 'stories'}
            </div>

            {/* Bookmarked Items List */}
            <div className="space-y-4">
              {filtered.map(article => (
                <div
                  key={article.id}
                  className="p-5 rounded-2xl tech-glass border border-slate-800/80 hover:border-blue-500/40 transition-all flex flex-col sm:flex-row gap-5 justify-between items-start"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <CategoryBadge category={article.category} size="sm" />
                      <span className="text-xs font-mono-code text-slate-400">{article.source}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs font-mono-code text-slate-400 flex items-center gap-1">
                        <Clock size={11} /> {article.readTimeMinutes || 4} min read
                      </span>
                    </div>

                    <Link to={`/article/${article.id}`} className="block group">
                      <h3 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-blue-400 transition-colors mb-1.5 leading-snug">
                        {article.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                      {article.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {article.topics.map((t, idx) => (
                        <span key={idx} className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col items-center gap-2 shrink-0 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
                    <Link
                      to={`/article/${article.id}`}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold font-mono-code transition-all"
                    >
                      Read Brief
                    </Link>

                    <a
                      href={article.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
                      title="Open source article"
                    >
                      <ExternalLink size={14} />
                    </a>

                    <button
                      onClick={() => removeBookmark(article.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-900/40 text-slate-400 hover:text-red-300 transition-colors border border-slate-700 cursor-pointer"
                      title="Remove from saved"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
