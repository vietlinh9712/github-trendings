# GitHub Trendings

**Discover emerging GitHub repositories with rising star velocity.**

GitHub Trendings surfaces hidden gem repos that are rapidly gaining momentum — before they hit mainstream trending.

```
$ github-trendings discover --window 7d --lang TypeScript --limit 10
```

## Features

- **Rising Star Discovery** — Score repos by star velocity × volume, not just raw stars
- **Time Windows** — Analyze 24h, 7d, or 30d windows
- **Language Filtering** — Filter by TypeScript, Python, Go, Rust, and more
- **JSON Output** — Machine-readable output for automation
- **Local Cache** — 5-minute cache to avoid GitHub rate limits

## Install

```bash
npm install -g github-trendings
```

Or build from source:

```bash
npm install
npm run build
```

## Usage

### Discover rising stars

```bash
# Default: 7-day window, top 20 repos
github-trendings discover

# 24-hour window, TypeScript only
github-trendings discover --window 24h --lang TypeScript

# 30-day window, JSON output
github-trendings discover --window 30d --json --limit 50
```

### Options

| Flag | Description | Default |
|------|-------------|---------|
| `-w, --window <window>` | Time window: `24h`, `7d`, `30d` | `7d` |
| `-l, --lang <lang>` | Programming language filter | — |
| `-n, --limit <n>` | Number of results | `20` |
| `--json` | JSON output | `false` |
| `--no-cache` | Disable caching | `false` |

### Cache

```bash
# Show cache stats
github-trendings cache --stats

# Clear cache
github-trendings cache --clear
```

## How It Works

GitHub Trendings uses GitHub's Search API to find repositories created within your time window, then scores them using a **velocity × volume** formula:

```
score = (stars / days_old) × log(stars + 1)
```

This rewards both new repos growing fast AND established repos with steady momentum.

## Output

```
#   Name                           Stars   Veloc  Lang       Description
------------------------------------------------------------------------
1   full_name/project              1234    45.2    TypeScript A great tool
2   other/repo                      890    32.1    Python     Does things
```

## License

MIT
