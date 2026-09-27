# TECHPULSE - Live Technology News & Intelligence Portal

> TECHPULSE is a modern full-stack technology news and intelligence portal built with React, TypeScript, Express, Tailwind CSS, and Gemini AI. It provides technology news discovery, trend analysis, bookmarking, search, article exploration, and an AI-powered intelligence dashboard.

LIVE DEMO: https://technews-lilac.vercel.app/


---

## Features

* Live Technology News Feed
* Trending Technology Topics
* AI-Powered Intelligence Dashboard
* Smart Search and Discovery
* Technology Trend Analysis
* Bookmark and Save Articles
* Recently Viewed Articles
* Submit Your Own Story
* Offline Bookmark Persistence
* Export Reading Lists
* Responsive Modern UI/UX
* Gemini API Integration
* Express API Proxy
* Vite-powered Development
* Tailwind CSS Design System

---

## Core Idea

TECHPULSE is designed as a technology intelligence command center rather than a simple news website.

The platform organizes technology stories into multiple categories, analyzes article trends, and provides users with a centralized interface for discovering and understanding technology developments.

### Technology Categories

* Artificial Intelligence
* Software
* Cybersecurity
* Cloud Computing
* Consumer Technology
* Biotechnology
* Robotics
* Space Technology
* FinTech
* Web Technology
* Enterprise Technology
* Emerging Technology

---

# Project Architecture

```text
TECHPULSE
│
├── metadata.json
│   └── AI Studio metadata
│
├── package.json
│   └── Dependencies and execution scripts
│
├── server.ts
│   └── Express full-stack server and Gemini API proxy
│
├── src/
│   │
│   ├── App.tsx
│   │   └── Primary router shell
│   │
│   ├── main.tsx
│   │   └── React DOM mounting
│   │
│   ├── index.css
│   │   └── Tailwind CSS and design tokens
│   │
│   ├── types/
│   │   └── article.ts
│   │       └── Normalized TypeScript article models
│   │
│   ├── data/
│   │   ├── categories.ts
│   │   │   └── Technology categories and colors
│   │   │
│   │   └── initialArticles.ts
│   │       └── Curated baseline dataset
│   │
│   ├── services/
│   │   ├── apiService.ts
│   │   │   └── Client API communication
│   │   │
│   │   └── storageService.ts
│   │       └── LocalStorage bookmarks and history
│   │
│   ├── hooks/
│   │   ├── useArticles.ts
│   │   │   └── Feed state, metrics and trend calculation
│   │   │
│   │   ├── useBookmarks.ts
│   │   │   └── Bookmark state management
│   │   │
│   │   ├── useDebounce.ts
│   │   │   └── Search debouncing
│   │   │
│   │   └── useRecentlyViewed.ts
│   │       └── Session history tracking
│   │
│   ├── components/
│   │   │
│   │   ├── common/
│   │   │   └── Navbar, Footer, Badges, Search,
│   │   │       Skeletons and Banner
│   │   │
│   │   ├── cards/
│   │   │   └── HeroStory, ArticleCard, NewsGrid,
│   │   │       CompactStoryRow
│   │   │
│   │   ├── details/
│   │   │   └── IntelligencePanel and ReadingProgress
│   │   │
│   │   ├── trending/
│   │   │   └── TrendingTopics radar
│   │   │
│   │   └── submit/
│   │       └── SubmitArticleModal with validation
│   │
│   └── pages/
│       ├── Home.tsx
│       │   └── Command Center
│       │
│       ├── LiveFeed.tsx
│       │   └── Live technology news feed
│       │
│       ├── Explore.tsx
│       │   └── Discovery and search
│       │
│       ├── ArticleDetails.tsx
│       │   └── Article deep dive
│       │
│       ├── Intelligence.tsx
│       │   └── AI Intelligence Dashboard
│       │
│       ├── Trending.tsx
│       │   └── Technology trend radar
│       │
│       ├── SavedArticles.tsx
│       │   └── Offline bookmarks
│       │
│       └── Methodology.tsx
│           └── Academic specification and evaluation guide
│
└── tsconfig.json
    └── TypeScript configuration
```

---

# Technology Stack

| Technology   | Purpose                          |
| ------------ | -------------------------------- |
| React        | Frontend application             |
| TypeScript   | Type-safe development            |
| Vite         | Development and production build |
| Tailwind CSS | UI styling                       |
| Express.js   | Full-stack server                |
| Gemini API   | AI-powered intelligence          |
| LocalStorage | Offline bookmarks and history    |
| Node.js      | Runtime environment              |

---

# Main Application Pages

## Home - Command Center

The main dashboard provides an overview of technology stories, trending topics, and important intelligence.

## Live Feed

Displays the latest technology stories in a structured news-feed interface.

## Explore

Allows users to discover and search technology stories using keywords and categories.

## Article Details

Provides a detailed view of an individual technology article, including intelligence information and reading progress.

## Intelligence

Provides AI-oriented analysis and technology intelligence derived from the available article dataset.

## Trending

Visualizes frequently occurring technology topics and emerging trends.

## Saved Articles

Stores bookmarked articles locally so users can access their saved reading list after refreshing the browser.

## Methodology

Documents the application's architecture, methodology, technical implementation, and academic evaluation points.

---

# Application Workflow

```text
                 Technology News
                       |
                       v
              Article Normalization
                       |
                       v
                React News Feed
                       |
          +------------+------------+
          |            |            |
          v            v            v
      Trending     Bookmarks    Intelligence
      Analysis      Storage       Dashboard
          |            |            |
          +------------+------------+
                       |
                       v
                User Insights
                 and Reading
```

---

# AI and Intelligence Architecture

TECHPULSE uses an AI-assisted architecture to provide technology intelligence.

The Gemini integration is handled through the Express server instead of directly exposing the API key in the frontend.

```text
React Frontend
      |
      v
Express Server
      |
      v
Gemini API
      |
      v
AI Processing
      |
      v
Intelligence Results
      |
      v
React Interface
```

This architecture helps keep the Gemini API credential on the server side.

---

# Trend Analysis

The application calculates technology trends using article topic and category frequency.

Example:

```text
Articles
   |
   +-- AI
   +-- AI
   +-- Cybersecurity
   +-- Robotics
   +-- AI
   +-- Robotics
          |
          v
   Frequency Analysis
          |
          +-- AI = 3
          +-- Robotics = 2
          +-- Cybersecurity = 1
          |
          v
   Trending Topics
```

The resulting information powers the Trending Topics Radar and intelligence-related components.

---

# Offline Capability

TECHPULSE uses browser LocalStorage to persist user-specific information.

### Stored Data

* Bookmarked articles
* Recently viewed articles
* Reading lists

### Workflow

```text
User Action
     |
     v
React State
     |
     v
Storage Service
     |
     v
LocalStorage
     |
     v
Persistent Browser Data
```

Users can bookmark an article, navigate to Saved Articles, refresh the browser, and continue accessing their saved reading list.

---

# Academic Evaluation Points

## 1. Component Modularity

The application follows a modular component architecture.

For example:

```text
ArticleCard
├── Standard Variant
├── Horizontal Variant
├── Image Fallback
├── Metadata
└── Category Badge
```

`ArticleCard.tsx` accepts different variants so that the same component can be reused across multiple pages.

---

## 2. State Management

Custom React hooks are used to separate application logic from UI components.

```text
useArticles()
useBookmarks()
useDebounce()
useRecentlyViewed()
```

`useArticles.ts` handles feed state, metrics, and trend calculations without unnecessarily modifying the underlying dataset.

---

## 3. Form Validation

The Submit Story feature includes:

* Required field validation
* Empty-field detection
* URL validation
* Real-time error states
* Instant insertion into application state

### Workflow

```text
User opens Submit Story
        |
        v
Enters article information
        |
        v
Validation
        |
   +----+----+
   |         |
 Invalid    Valid
   |         |
   v         v
Errors    Add Story
             |
             v
        Update Feed
```

---

## 4. Offline Persistence

Bookmarking and recently viewed functionality uses browser storage.

```text
User Action
     |
     v
React State
     |
     v
Storage Service
     |
     v
LocalStorage
```

---

# Setup and Execution

## Prerequisites

Make sure you have:

* Node.js 20+
* npm or yarn
* Modern web browser

---

## Installation

Clone the repository:

```bash
git clone https://github.com/Prathiksha-K1/technews.git
```

Navigate into the project:

```bash
cd technews
```

Install dependencies:

```bash
npm install
```

---

# Environment Variables

Create a `.env` file:

```bash
cp .env.example .env
```

Add your Gemini API key:

```env
GEMINI_API_KEY=your_api_key_here
```

The Gemini API key is optional if the application is configured to use its local fallback dataset.

---

# Run Development Server

Start the full-stack development environment:

```bash
npm run dev
```

The application runs through the Express and Vite development setup.

Open:

```text
http://localhost:3000
```

---

# TypeScript and Code Check

Run the project validation command:

```bash
npm run lint
```

---

# Production Build

Create a production build:

```bash
npm run build
```

---

# Start Production Server

```bash
npm start
```

---

# Live Demo

https://technews-lilac.vercel.app/

---

# GitHub Repository

https://github.com/Prathiksha-K1/technews

---

# Application Screenshots

Add application screenshots inside a `docs` folder:

```text
docs/
├── home.png
├── live-feed.png
├── explore.png
├── article-details.png
├── intelligence.png
├── trending.png
└── saved-articles.png
```

Example:

```markdown
![TECHPULSE Home](docs/home.png)

![Live Feed](docs/live-feed.png)

![AI Intelligence Dashboard](docs/intelligence.png)
```

---

# Project Objectives

TECHPULSE was designed to demonstrate how a modern technology information platform can combine:

* React-based modular architecture
* TypeScript
* AI-assisted intelligence
* Trend analysis
* Search and discovery
* Persistent browser storage
* Responsive UI/UX
* Full-stack API architecture

The objective is to transform a traditional technology news interface into an interactive technology intelligence portal.

---

# Future Enhancements

Potential future improvements include:

* Real-time external news APIs
* Advanced article summarization
* Personalized AI news recommendations
* Historical trend analytics
* Real-time breaking-news alerts
* AI-powered article Q&A
* Semantic search using embeddings
* Multi-source news aggregation
* Regional technology intelligence
* Advanced analytics dashboards
* User authentication
* Cloud database integration

---

# Author

**Prathiksha K**

B.Tech Computer Science and Engineering

**Project:** TECHPULSE - Live Technology News & Intelligence Portal

---

# License

This project is developed for academic, educational, and demonstration purposes.
