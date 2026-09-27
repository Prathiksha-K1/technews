# TECHPULSE - Live Technology News & Intelligence Portal

> **Academic Project Brief**: An individual academic ReactJS web application engineering a technology news and intelligence command center. Features real-time RSS ingestion, deterministic dataset fallbacks, AI-powered article intelligence with Gemini 3.8 Flash, trend frequency discovery, and offline bookmark persistence.

---

## 1. Project Objective

To build an original, production-quality technology intelligence portal that satisfies the academic requirements of a ReactJS news interface while extending the concept into a modern command center. The application avoids generic dashboard templates, emphasizing information hierarchy, accessible dark-first aesthetics, verified metrics, and secure server-side AI integration.

---

## 2. Academic Problem Statement

> **"Tech News Interface – Display technology news from a local dataset with categories, search, and article details."**

This project fulfills and extends the problem statement through:
1. **Interactive Multi-View Architecture**: 7 distinct functional views (Command Center, Live Feed, Explore, Article Details, Intelligence Dashboard, Trending Topics, Saved Articles).
2. **Local Dataset Support**: Comprehensive normalized dataset of verified dispatches across 12 primary technology domains.
3. **Multi-Facet Search & Filtering**: Debounced query processing, category matrix, and topic tag filtering.
4. **Form Handling & Validation**: Custom news submission modal with 8 client-side validation rules and immediate state ingestion.
5. **AI-Powered Intelligence**: Server-side Gemini 3.8 Flash integration for executive summaries, named entity extraction, and "why it matters" systemic impact reasoning.

---

## 3. Core Features

- **Technology Intelligence Command Center (Home)**:
  - Real-time status banner indicating live ingestion or honest fallback state.
  - Anchor story showcase with AI systemic impact brief.
  - Dynamic dataset metrics (stories tracked, active categories, verified sources, total reading time).
  - Trending radar highlighting recurring dataset topics.
  - Category chip navigation and latest stories grid.
- **Dedicated Live Feed (`/feed`)**:
  - Continuous wire with refresh controls, sorting (newest, reading time, publisher), and layout toggling (cards vs compact).
  - Real public RSS integration (Hacker News, Ars Technica, The Verge) with graceful local fallback.
- **Explore & Discovery (`/explore`)**:
  - Debounced search input synchronized with URL parameters.
  - Multi-topic taxonomy filter.
  - Session history carousel tracking recently examined stories.
- **Article Details View (`/article/:id`)**:
  - Full metadata: author byline, publisher attribution, reading time, published timestamp.
  - Contextual abstract and excerpt.
  - Original publication link respecting source copyright.
  - Reading progress bar at top of viewport.
  - Related stories in the same domain.
- **AI Intelligence Hub (`/intelligence`)**:
  - Cross-corpus macro trend synthesis powered by Gemini 3.8 Flash.
  - Interactive story picker for deep analytical extraction.
  - Emerging themes matrix.
  - Transparent labeling of AI-generated analysis.
- **Trending Topics Radar (`/trending`)**:
  - Deterministic topic frequency calculations from active dataset (no fabricated numbers).
  - Momentum and velocity meters.
  - Filterable trend dossiers.
- **Offline Reading List (`/saved`)**:
  - Client-side persistence using `localStorage`.
  - Search and filter within saved articles.
  - Export capabilities (Markdown & JSON reading list formats).
- **Academic Architecture Dossier (`/methodology`)**:
  - Problem statement rubric checklist, normalized schemas, and architectural explanation for evaluators.

---

## 4. Technology Stack

- **Frontend**:
  - React 19 (Functional Components, Hooks)
  - TypeScript 5.8+ (Strict Type Checking)
  - React Router v7 (`react-router-dom`)
  - Tailwind CSS v4 (Glassmorphic surfaces, dark-first intelligence aesthetic)
  - Lucide React (Icons)
- **Backend & Middleware**:
  - Node.js & Express
  - `@google/genai` (Gemini 3.8 Flash model via secure server proxy)
  - `fast-xml-parser` (Public RSS feed XML ingestion)
  - `dotenv` (Environment variable management)
- **Persistence**:
  - Browser `localStorage` for bookmarks, session history, and student submissions.

---

## 5. Security & API Architecture

- **Zero Client Secret Exposure**:
  - The `GEMINI_API_KEY` is strictly managed on the Express server (`server.ts`).
  - Frontend components communicate via `/api/intelligence/analyze` and `/api/intelligence/synthesize-trends`.
  - No secret keys are included in client bundles.
- **Graceful Degradation**:
  - When offline or when the Gemini API key is not configured, the system transparently utilizes a deterministic heuristic analytical engine with clear UI notification.
- **Respect for Publisher Content**:
  - Excerpts and abstracts are provided with direct outbound links to original publisher articles.

---

## 6. Project Structure

```
├── .env.example              # Environment variables template
├── .gitignore                # Git exclusions
├── index.html                # HTML entry point with metadata & web fonts
├── metadata.json             # AI Studio metadata
├── package.json              # Dependencies and execution scripts
├── server.ts                 # Express full-stack server & Gemini API proxy
├── src/
│   ├── App.tsx               # Primary router shell
│   ├── main.tsx              # React DOM mounting
│   ├── index.css             # Tailwind CSS & design tokens
│   ├── types/
│   │   └── article.ts        # Normalized TypeScript models
│   ├── data/
│   │   ├── categories.ts     # 12 Primary technology categories & colors
│   │   └── initialArticles.ts# Curated baseline dataset
│   ├── services/
│   │   ├── apiService.ts     # Client API communication
│   │   └── storageService.ts # LocalStorage bookmarks & history
│   ├── hooks/
│   │   ├── useArticles.ts    # Feed state, metrics & trend calculation
│   │   ├── useBookmarks.ts   # Bookmark state management
│   │   ├── useDebounce.ts    # Search debouncing
│   │   └── useRecentlyViewed.ts # Session history tracking
│   ├── components/
│   │   ├── common/           # Navbar, Footer, Badges, Search, Skeletons, Banner
│   │   ├── cards/            # HeroStory, ArticleCard, NewsGrid, CompactStoryRow
│   │   ├── details/          # IntelligencePanel, ReadingProgress
│   │   ├── trending/         # TrendingTopics radar
│   │   └── submit/           # SubmitArticleModal with form validation
│   └── pages/
│       ├── Home.tsx          # Command Center
│       ├── LiveFeed.tsx      # Live news feed
│       ├── Explore.tsx       # Discovery and search
│       ├── ArticleDetails.tsx# Article deep dive
│       ├── Intelligence.tsx  # AI Intelligence Dashboard
│       ├── Trending.tsx      # Trend frequency radar
│       ├── SavedArticles.tsx # Offline bookmarks
│       └── Methodology.tsx   # Academic specification & rubric guide
└── tsconfig.json             # TypeScript configuration
```

---

## 7. Setup & Execution

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation
```bash
# Clone the repository and install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your GEMINI_API_KEY in .env (optional; local fallback operates without key)

# Run full-stack development server (Express + Vite on port 3000)
npm run dev

# Run TypeScript compilation check
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

---

## 8. Academic Evaluation Points

When explaining this application during an evaluation:
1. **Component Modularity**: Check `src/components/cards/ArticleCard.tsx` and notice how it accepts variant flags (`standard`, `horizontal`) and handles image fallbacks cleanly.
2. **State Management**: Notice the custom hook `useArticles.ts` calculating active trends directly from dataset frequency arrays without modifying state.
3. **Form Handling**: Open "Submit Story", attempt submitting empty fields, and observe real-time error states, URL structure validation, and instant state insertion.
4. **Offline Capability**: Bookmark articles in Command Center, navigate to Saved Articles, export reading lists, or refresh the browser—all state persists reliably.
#   t e c h s p a c e  
 #   t e c h n e w s  
 