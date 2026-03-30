# FindStars — Progress Log

## 2026-03-30

### Phase 0: Research
- Scraped GitHub Trending to identify white-space niches
- Identified opportunity: momentum-based "rising star" discovery (vs raw trending)
- White space: no CLI tool combines star velocity + time windows + JSON output
- Decision: Build **FindStars** — CLI for discovering underrated emerging GitHub repos

### Phase 1: Architecture & Business Planning
- Spec written: `.omc/autopilot/spec.md`
- Implementation plan written: `.omc/plans/autopilot-impl.md`
- Tech stack: TypeScript, Node.js, commander.js, axios, cheerio, vitest

### Phase 2: Implementation

#### Files Created
- `package.json` — name: findstars, bin: findstars
- `tsconfig.json` — strict ES2022
- `vitest.config.ts` — test configuration
- `src/types.ts` — Repo, ScoredRepo, CacheEntry, DiscoverOptions, GitHubSearchResponse
- `src/cli.ts` — commander.js CLI with `discover` and `cache` commands
- `src/commands/discover.ts` — discover command orchestrator
- `src/lib/cache.ts` — in-memory TTL cache
- `src/lib/github.ts` — GitHub Search API client with pagination + rate-limit handling
- `src/lib/scorer.ts` — velocity × volume scoring + burst detection + ranking
- `src/lib/formatter.ts` — ASCII table + JSON output
- `tests/scorer.test.ts` — 9 tests (velocity, score, burst, rank)
- `tests/cache.test.ts` — 6 tests (get/set/TTL/clear/stats)
- `tests/formatter.test.ts` — 5 tests (table, JSON)
- `README.md` — install, usage, architecture

#### Bug Fixed During Build
- `formatter.ts`: snake_case `col_widths` → camelCase `colWidths` (TypeScript error)

#### Build & Test Results
- `npm run build`: SUCCESS (clean)
- `npm test`: 20/20 tests PASS

#### Smoke Test
- `findstars discover --window 24h --limit 5` — returns real ranked repos from GitHub API
- Output format verified: rank, name, stars, velocity, language, description

### Key Design Decisions
1. **Scoring**: `velocity × log(stars+1)` — rewards new fast growers AND established steady growers
2. **Cache**: 5-minute TTL in-memory Map — avoids GitHub rate limits (60/hour unauthenticated)
3. **API Strategy**: GitHub Search API with pagination (up to 500 results per query)
4. **Output**: ASCII table for humans, JSON for machines

### Phase 3: What's Next
- Real-world test with different time windows and languages
- Consider adding: topics filter, star range filter, repo size filter
- Consider: publish to npm as `findstars`
- Business model: free OSS, potential GitHub Sponsors or premium analytics tier
