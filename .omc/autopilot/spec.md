# FindStars — Emerging GitHub Repo Discovery Engine

## 1. Concept & Vision

**FindStars** is a CLI tool that surfaces *hidden gem* GitHub repositories — repos that are rapidly gaining momentum but haven't yet hit mainstream trending. Unlike GitHub trending (which highlights saturated projects), FindStars discovers underrated projects with real growth signals: rising star velocity, burst star patterns, emerging contributors, and fresh GitHub activity.

Target user: **developers, indie hackers, and tech investors** who want to find the next breakout open-source project before it explodes.

Tagline: *"Find the next big thing before it finds you."*

---

## 2. Tech Stack

- **Language**: TypeScript / Node.js (accessible to npm ecosystem)
- **Runtime**: Node.js 18+
- **Package Manager**: npm
- **CLI Framework**: commander.js (mature, typed, widely used)
- **HTTP Client**: axios (proven, small footprint)
- **HTML Parser**: cheerio (fast DOM parsing without a browser)
- **Data Output**: JSON (machine-readable) + ASCII table (human-readable)
- **Caching**: In-memory with TTL (avoid hammering GitHub API)
- **Testing**: Vitest (fast, modern, native TypeScript support)

---

## 3. Core Features

### F1: Rising Stars Discovery
- Fetch a configurable time window (24h, 7d, 30d)
- Score repos by star velocity (stars_per_day) and momentum (burst pattern detection)
- Rank and display top N results with key metrics

### F2: Language Filtering
- `--lang` flag to filter by primary language (TypeScript, Python, Go, Rust, etc.)
- Multi-language support: `--lang typescript --lang python`

### F3: Multi-List Aggregation
- Combine: trending, new-repos, and "most-starred-recently" into a unified ranked view
- Weighted scoring: recency × velocity × volume

### F4: JSON Output Mode
- `--json` flag outputs machine-readable structured data
- Includes: name, description, stars, stars_24h, language, url, created_at, topics[]

### F5: Local Cache
- Cache GitHub responses for 5 minutes (avoid rate limiting)
- `--no-cache` flag to force fresh fetch

### F6: Interactive Mode (Stretch)
- `--interactive` / `-i` opens a pager-style view with keyboard navigation

---

## 4. Target Users

1. **Indie Hackers** — Find emerging tools to integrate into products
2. **Tech Investors / Scouts** — Surface early-stage projects with traction
3. **Developers** — Discover new libraries before they become mainstream
4. **OSS Contributors** — Find active projects needing help

---

## 5. Differentiation from Existing Solutions

| Feature | GitHub Trending | FindStars |
|---|---|---|
| Shows popular/recent | Popular only | Both + momentum scoring |
| Filters by growth velocity | No | Yes |
| CLI tool | No | Yes |
| JSON output | No | Yes |
| Custom time windows | No | Yes |
| Language filter | Basic | Multi-value |

---

## 6. Architecture

```
findstars/
├── src/
│   ├── cli.ts           # Commander.js CLI entry
│   ├── commands/
│   │   ├── discover.ts  # discover command (main)
│   │   └── cache.ts     # cache management
│   ├── lib/
│   │   ├── github.ts    # GitHub API client (REST)
│   │   ├── scorer.ts    # Star velocity & momentum scoring
│   │   ├── cache.ts     # In-memory cache with TTL
│   │   └── formatter.ts # Output formatters (table, JSON)
│   └── types.ts         # TypeScript interfaces
├── tests/
│   ├── scorer.test.ts
│   ├── github.test.ts
│   └── formatter.test.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## 7. Success Metrics

- Discover 50+ repos per run across time windows
- Sub-5-second fetch time for 24h window (cached)
- Passes all unit tests
- Builds to a distributable CLI binary (or npm-installable global)

---

## 8. Open Questions (to validate during build)

1. GitHub unauthenticated rate limit (60/hour) — is this enough for CLI use?
2. Should we use GitHub REST API or scrape the trending page directly?
3. What's the best scoring algorithm: linear velocity, exponential burst, or hybrid?
