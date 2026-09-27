import React, { useState } from 'react';
import { X, Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { TechCategory, Article } from '../../types/article';
import { TECH_CATEGORIES } from '../../data/categories';
import { storageService } from '../../services/storageService';

interface SubmitArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onArticleAdded?: (newArticle: Article) => void;
}

interface FormState {
  title: string;
  category: TechCategory;
  source: string;
  sourceUrl: string;
  author: string;
  description: string;
  fullExcerpt: string;
  topics: string;
  imageUrl: string;
}

interface FormErrors {
  title?: string;
  category?: string;
  source?: string;
  sourceUrl?: string;
  author?: string;
  description?: string;
  fullExcerpt?: string;
  topics?: string;
}

const INITIAL_FORM: FormState = {
  title: '',
  category: 'Artificial Intelligence',
  source: '',
  sourceUrl: '',
  author: '',
  description: '',
  fullExcerpt: '',
  topics: '',
  imageUrl: ''
};

export const SubmitArticleModal: React.FC<SubmitArticleModalProps> = ({
  isOpen,
  onClose,
  onArticleAdded
}) => {
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // 1. Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Headline title is required.';
    } else if (formData.title.trim().length < 12) {
      newErrors.title = 'Title must be at least 12 characters long.';
    }

    // 2. Category validation
    if (!formData.category) {
      newErrors.category = 'Please select a valid technology category.';
    }

    // 3. Source validation
    if (!formData.source.trim()) {
      newErrors.source = 'Publication or source name is required.';
    }

    // 4. Source URL validation
    if (!formData.sourceUrl.trim()) {
      newErrors.sourceUrl = 'Source URL is required.';
    } else {
      try {
        const parsed = new URL(formData.sourceUrl);
        if (!['http:', 'https:'].includes(parsed.protocol)) {
          newErrors.sourceUrl = 'URL must start with http:// or https://';
        }
      } catch {
        newErrors.sourceUrl = 'Please enter a valid URL (e.g. https://domain.com/story).';
      }
    }

    // 5. Author validation
    if (!formData.author.trim()) {
      newErrors.author = 'Author or editorial byline is required.';
    } else if (formData.author.trim().length < 3) {
      newErrors.author = 'Author name must be at least 3 characters.';
    }

    // 6. Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Executive summary/description is required.';
    } else if (formData.description.trim().length < 25) {
      newErrors.description = 'Description must be at least 25 characters to provide sufficient context.';
    }

    // 7. Full excerpt validation
    if (!formData.fullExcerpt.trim()) {
      newErrors.fullExcerpt = 'Detailed technical excerpt is required.';
    } else if (formData.fullExcerpt.trim().length < 40) {
      newErrors.fullExcerpt = 'Excerpt must be at least 40 characters for AI analysis.';
    }

    // 8. Topics validation
    const parsedTopics = formData.topics.split(',').map(t => t.trim()).filter(Boolean);
    if (parsedTopics.length < 2) {
      newErrors.topics = 'Please provide at least 2 comma-separated topic tags (e.g. LLM, Hardware).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const parsedTopics = formData.topics.split(',').map(t => t.trim()).filter(Boolean);

    const newArticle: Article = {
      id: `user-${Date.now()}`,
      title: formData.title.trim(),
      category: formData.category,
      source: formData.source.trim(),
      sourceUrl: formData.sourceUrl.trim(),
      author: formData.author.trim(),
      description: formData.description.trim(),
      fullExcerpt: formData.fullExcerpt.trim(),
      publishedAt: new Date().toISOString(),
      topics: parsedTopics,
      imageUrl: formData.imageUrl.trim() || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      readTimeMinutes: Math.max(3, Math.ceil(formData.fullExcerpt.split(' ').length / 140)),
      aiSummary: formData.description.trim(),
      whyItMatters: `Submitted under ${formData.category} track for intelligence evaluation.`,
      keyPoints: [
        `Dispatched by ${formData.author} via ${formData.source}`,
        `Categorized under ${formData.category}`,
        `Focus areas: ${parsedTopics.join(', ')}`
      ],
      technologies: parsedTopics.slice(0, 3),
      entities: [formData.source.trim()],
      isLive: false
    };

    // Save to local storage
    storageService.saveUserSubmission(newArticle);
    window.dispatchEvent(new Event('articles-updated'));

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      onArticleAdded?.(newArticle);

      setTimeout(() => {
        setIsSuccess(false);
        setFormData(INITIAL_FORM);
        onClose();
      }, 1500);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-mono-code text-blue-400 font-semibold uppercase mb-1">
            <Sparkles size={14} />
            <span>Academic Dispatch Form</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Submit Technology Intelligence Story
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Demonstrates React controlled form handling, dynamic client-side validation, and instant dataset ingestion.
          </p>
        </div>

        {/* Success Banner */}
        {isSuccess ? (
          <div className="py-12 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-lg font-bold text-emerald-300">
              Story Ingested Successfully!
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Your article has been validated and added to the TECHPULSE local dataset.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Headline Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Next-Generation Speculative Decoding Accelerates Inference"
                className={`w-full px-3.5 py-2 rounded-xl bg-slate-950 border text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 ${
                  errors.title
                    ? 'border-red-500 focus:ring-red-500/30'
                    : 'border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
              />
              {errors.title && (
                <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.title}
                </p>
              )}
            </div>

            {/* Category and Author */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Technology Category <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as TechCategory })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  {TECH_CATEGORIES.map(cat => (
                    <option key={cat.slug} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Author / Byline <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={e => setFormData({ ...formData, author: e.target.value })}
                  placeholder="e.g. Dr. Alex Mercer"
                  className={`w-full px-3.5 py-2 rounded-xl bg-slate-950 border text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 ${
                    errors.author
                      ? 'border-red-500 focus:ring-red-500/30'
                      : 'border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
                  }`}
                />
                {errors.author && (
                  <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.author}
                  </p>
                )}
              </div>
            </div>

            {/* Source and Source URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Source Publication <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={e => setFormData({ ...formData, source: e.target.value })}
                  placeholder="e.g. MIT Technology Review"
                  className={`w-full px-3.5 py-2 rounded-xl bg-slate-950 border text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 ${
                    errors.source
                      ? 'border-red-500 focus:ring-red-500/30'
                      : 'border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
                  }`}
                />
                {errors.source && (
                  <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.source}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Source URL <span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  value={formData.sourceUrl}
                  onChange={e => setFormData({ ...formData, sourceUrl: e.target.value })}
                  placeholder="https://example.com/article"
                  className={`w-full px-3.5 py-2 rounded-xl bg-slate-950 border text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 ${
                    errors.sourceUrl
                      ? 'border-red-500 focus:ring-red-500/30'
                      : 'border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
                  }`}
                />
                {errors.sourceUrl && (
                  <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.sourceUrl}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Executive Summary / Description <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="High-level overview of the architectural or technological breakthrough..."
                className={`w-full px-3.5 py-2 rounded-xl bg-slate-950 border text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 ${
                  errors.description
                    ? 'border-red-500 focus:ring-red-500/30'
                    : 'border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
              />
              {errors.description && (
                <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.description}
                </p>
              )}
            </div>

            {/* Full Excerpt */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Technical Excerpt / Notes <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={3}
                value={formData.fullExcerpt}
                onChange={e => setFormData({ ...formData, fullExcerpt: e.target.value })}
                placeholder="Detailed technical context, architecture specifications, or benchmark metrics..."
                className={`w-full px-3.5 py-2 rounded-xl bg-slate-950 border text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 ${
                  errors.fullExcerpt
                    ? 'border-red-500 focus:ring-red-500/30'
                    : 'border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
              />
              {errors.fullExcerpt && (
                <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.fullExcerpt}
                </p>
              )}
            </div>

            {/* Topics & Optional Image */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Topic Tags (comma-separated) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.topics}
                  onChange={e => setFormData({ ...formData, topics: e.target.value })}
                  placeholder="e.g. LLM, Speculative, CUDA"
                  className={`w-full px-3.5 py-2 rounded-xl bg-slate-950 border text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 ${
                    errors.topics
                      ? 'border-red-500 focus:ring-red-500/30'
                      : 'border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
                  }`}
                />
                {errors.topics && (
                  <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.topics}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Image URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50 cursor-pointer"
              >
                <Send size={13} />
                <span>{isSubmitting ? 'Validating...' : 'Submit & Ingest Story'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
