import { NextRequest, NextResponse } from 'next/server';

interface Repo {
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  html_url: string;
  created_at: string;
  topics: string[];
  pushed_at: string;
}

function daysSince(dateStr: string): number {
  const created = new Date(dateStr);
  const now = new Date();
  return Math.max(1, Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)));
}

function calculateVelocity(repo: Repo): number {
  return repo.stargazers_count / daysSince(repo.created_at);
}

function calculateScore(repo: Repo): number {
  const velocity = calculateVelocity(repo);
  return velocity * Math.log(repo.stargazers_count + 1);
}

function detectBurst(repo: Repo): boolean {
  return repo.stargazers_count > 20 && daysSince(repo.created_at) < 30;
}

function windowToDays(window: string): number {
  return window === '24h' ? 1 : window === '7d' ? 7 : 30;
}

function buildSearchQuery(window: string, lang?: string): string {
  const days = windowToDays(window);
  const now = new Date();
  const date = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  const dateStr = date.toISOString().split('T')[0];
  let query = `created:>${dateStr} stars:>5`;
  if (lang) {
    query += ` language:${lang}`;
  }
  return query;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const window = searchParams.get('window') || '7d';
  const lang = searchParams.get('lang') || '';
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);

  const query = buildSearchQuery(window, lang);
  const allRepos: Repo[] = [];
  const PER_PAGE = 100;
  const MAX_PAGES = 5;

  for (let page = 1; page <= MAX_PAGES; page++) {
    const params = new URLSearchParams({
      q: query,
      sort: 'stars',
      order: 'desc',
      per_page: String(PER_PAGE),
      page: String(page),
    });

    try {
      const res = await fetch(`https://api.github.com/search/repositories?${params}`, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'github-trendings-web',
        },
      });

      if (res.status === 403) {
        return NextResponse.json(
          { error: 'GitHub API rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }

      if (!res.ok) {
        return NextResponse.json(
          { error: `GitHub API error: ${res.status}` },
          { status: res.status }
        );
      }

      const data = await res.json();
      const items: Repo[] = data.items.map((item: Record<string, unknown>) => ({
        name: item.name as string,
        full_name: item.full_name as string,
        description: item.description as string | null,
        stargazers_count: item.stargazers_count as number,
        language: item.language as string | null,
        html_url: item.html_url as string,
        created_at: item.created_at as string,
        topics: (item.topics as string[]) || [],
        pushed_at: item.pushed_at as string,
      }));

      allRepos.push(...items);
      if (items.length < PER_PAGE) break;
    } catch (err) {
      console.error('Fetch error:', err);
      return NextResponse.json(
        { error: 'Failed to fetch from GitHub API' },
        { status: 500 }
      );
    }
  }

  // Score and rank
  const scored = allRepos.map(repo => {
    const velocity = calculateVelocity(repo);
    const score = calculateScore(repo);
    const burst = detectBurst(repo);
    return { ...repo, velocity, score, burst };
  });

  scored.sort((a, b) => b.score - a.score);

  const ranked = scored.slice(0, limit).map((repo, index) => ({
    ...repo,
    rank: index + 1,
    velocity: Math.round(repo.velocity * 100) / 100,
    score: Math.round(repo.score * 100) / 100,
  }));

  return NextResponse.json(ranked, {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
}
