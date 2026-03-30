# FindStars — Business Plan

## 1. Product Overview

**FindStars** is an open-source CLI tool that surfaces emerging GitHub repositories with rising star velocity — hidden gems before they hit mainstream trending.

## 2. Target Users

| Segment | Use Case | Pain Point |
|---------|----------|------------|
| **Indie Hackers** | Find emerging tools to integrate into products | GitHub Trending is saturated with popular repos; hard to spot the next breakout |
| **Tech Investors / Scouts** | Surface early-stage projects with traction | No good free tool for momentum-based discovery |
| **Open Source Contributors** | Find active, growing projects needing help | Trending doesn't reflect growth velocity |
| **Developers** | Discover new libraries before they become mainstream | Twitter/Reddit are noisy; no programmatic way |

## 3. Use Cases

1. **Daily Discovery** — Run `findstars discover --window 24h` each morning to catch overnight movers
2. **Language Scouting** — `findstars discover --lang Rust` to find rising Rust projects
3. **Market Research** — Analyze which language ecosystems are gaining momentum this month
4. **Investment Sourcing** — JSON output piped to a spreadsheet for tracking emerging projects
5. **Contribution Discovery** — Find active projects with growing communities

## 4. Monetization Strategy (Open Source Ecosystem)

**Core tool is free and open source (MIT license).**

Revenue paths:
1. **GitHub Sponsors** — Developers who find value can sponsor the project
2. **Premium Analytics Tier** — A hosted version at `findstars.dev` with:
   - Historical trend tracking (30/60/90 day momentum charts)
   - Email alerts for repos crossing velocity thresholds
   - Topic/category filtering beyond language
   - API access for programmatic use
3. **Data Licensing** — Aggregate, anonymized data on emerging repos sold to VC firms and accelerators

## 5. Marketing Angles

1. **"Find the next big thing before it finds you"** — discovery framing
2. **For hackers** — "GitHub Trending, but actually useful"
3. **For investors** — "GitHub scrapes for deal flow without the manual work"
4. **Launch on**: Hacker News, Reddit r/programming, Twitter/X dev communities, LinkedIn indie hacker groups

## 6. Competitive Landscape

| Tool | Pros | Cons |
|------|------|------|
| GitHub Trending | Official, real-time | Popular only; no velocity scoring; no CLI |
| Star History | Beautiful charts | No discovery; requires manual list |
| OSS Insight | Good for established | No real-time discovery |
| **FindStars** | CLI, velocity scoring, JSON, free | Needs brand awareness |

## 7. Roadmap

### v0.1.0 (Current) — MVP
- [x] GitHub API integration
- [x] Star velocity scoring
- [x] 24h/7d/30d time windows
- [x] Language filtering
- [x] JSON + table output
- [x] In-memory cache

### v0.2.0
- [ ] Topics filter (`--topic ai`, `--topic cli`)
- [ ] Star range filter (`--stars-min 100`)
- [ ] `--json` output enhancements (include velocity rank, burst flag)
- [ ] Better error messages for rate limits

### v1.0.0
- [ ] npm publish (`npm install -g findstars`)
- [ ] Pre-built binaries (GitHub Releases)
- [ ] Interactive mode (`--interactive`)
- [ ] `findstars watch` — continuous monitoring with alerts

### v1.5.0 (Premium)
- [ ] Hosted web dashboard at findstars.dev
- [ ] Email alerts
- [ ] Historical trend data
- [ ] GitHub OAuth for higher rate limits

## 8. Success Metrics (30/60/90 days)

- **Stars**: 100 → 500 → 2000 GitHub stars
- **npm installs**: 50 → 500 → 5000 monthly
- **Community**: 5 → 20 → 50 contributors
- **Buzz**: 1 HN front page mention

## 9. Legal / License

- License: MIT
- GitHub API usage: Complies with GitHub Terms of Service (unauthenticated, rate-limited)
- No scraping — uses official Search API only
