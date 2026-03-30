# FindStars — Implementation Plan

## Phase 1: Project Scaffolding

### 1.1 Initialize npm project
- Create `package.json` with name `findstars`, version `0.1.0`
- Dependencies: `commander`, `axios`, `cheerio`
- DevDependencies: `typescript`, `@types/node`, `vitest`
- Add scripts: `build`, `test`, `dev`
- Add `bin` field for CLI entry point

### 1.2 TypeScript configuration
- Create `tsconfig.json` with strict mode, ES2022 target
- OutDir: `dist`, RootDir: `src`

---

## Phase 2: Core Library

### 2.1 Types (`src/types.ts`)
Define interfaces:
- `Repo`: { name, full_name, description, stargazers_count, language, html_url, created_at, topics, pushed_at }
- `ScoredRepo`: `Repo` + { score, velocity, rank }
- `CacheEntry<T>`: { data: T, timestamp: number, ttl: number }
- `DiscoverOptions`: { window: '24h'|'7d'|'30d', lang?: string, limit: number, json: boolean }

### 2.2 GitHub API Client (`src/lib/github.ts`)
- `fetchTrendingRepos(window, lang?)`: GET GitHub search API
  - Query: `created:>YYYY-MM-DD stars:>10` sorted by stars
  - Handle pagination (max 100 per page, up to 10 pages)
  - Respect rate limits (60/hour unauthenticated)
- `fetchRepoStats(fullName)`: GET repo details for additional metrics
- Error handling: retry once on 403/rate-limit, throw descriptive errors

### 2.3 Cache (`src/lib/cache.ts`)
- In-memory Map-based cache
- `get<T>(key): T|null` — returns data if not expired
- `set<T>(key, data, ttlMs)`: stores with timestamp
- Default TTL: 5 minutes
- Auto-cleanup of expired entries

### 2.4 Scorer (`src/lib/scorer.ts`)
- `calculateVelocity(repo, windowDays)`: stars / days_since_created (floor at 1)
- `calculateScore(repo, windowDays)`: velocity × log(stargazers + 1)
- `rankRepos(repos, windowDays)`: sort by score descending, assign rank
- Burst detection: flag if >50% stars came in last 24h

### 2.5 Formatter (`src/lib/formatter.ts`)
- `formatTable(repos: ScoredRepo[]): string` — ASCII table with columns: Rank, Name, Stars, Veloc, Lang, Description (truncated)
- `formatJSON(repos: ScoredRepo[]): string` — JSON.stringify with indent

---

## Phase 3: CLI

### 3.1 Entry Point (`src/cli.ts`)
- commander.js setup
- Global flags: `--json`, `--no-cache`, `--debug`
- Command: `discover` (default)
  - Flags: `--window <24h|7d|30d>`, `--lang <lang>`, `--limit <N>`, `--top`
  - Calls `discoverCommand(options)` and outputs result

### 3.2 Discover Command (`src/commands/discover.ts`)
- Load cache
- Call `fetchTrendingRepos` with options
- Score and rank repos
- Format and print output
- Handle errors gracefully (API fail → show cached or exit with message)

---

## Phase 4: Testing

### 4.1 Scorer tests (`tests/scorer.test.ts`)
- calculateVelocity: new repo with 100 stars → high velocity
- calculateScore: velocity × log volume scoring
- rankRepos: correct ordering

### 4.2 Cache tests (`tests/cache.test.ts`)
- get/set basic operations
- TTL expiry works correctly
- cleanup removes expired entries

### 4.3 Formatter tests (`tests/formatter.test.ts`)
- JSON output parses correctly
- Table output contains expected columns

---

## Phase 5: README

- Install: `npm install -g findstars`
- Usage examples for each flag
- Screenshot/ASCII demo of output
- Architecture overview
- License: MIT

---

## Execution Order

1. Scaffold (package.json, tsconfig.json, directory structure)
2. Types
3. Cache lib
4. GitHub lib
5. Scorer lib
6. Formatter lib
7. CLI wiring
8. Tests (scaffolding + scorer + cache + formatter)
9. README
10. Integration test (run full discover flow)

---

## Open Questions Resolved

1. **Rate limiting**: Use GitHub Search API (authenticated not required for basic use). Cache aggressively. Show clear message when rate limited.
2. **API vs scraping**: Use Search API — more reliable, structured data, respects pagination.
3. **Scoring algorithm**: Hybrid — velocity (stars/days) × log(total_stars) rewards both new-fast-growing AND established-growing repos.
